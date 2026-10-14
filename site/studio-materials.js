import * as T from './vendor/three.module.js';

// Object-space surface detail stays attached to real geometry throughout the shot.
export function tactile(material, kind = 'paper', amount = 1) {
  material.onBeforeCompile = shader => {
    shader.vertexShader = 'varying vec3 vSurfaceP;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvSurfaceP = position;');
    shader.fragmentShader = 'varying vec3 vSurfaceP;\nfloat grain(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}\n' + shader.fragmentShader;
    const frequency = kind === 'metal' ? 'vec3(80., 1800., 80.)' : kind === 'plaster' ? 'vec3(240.)' : 'vec3(1500., 160., 1500.)';
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
      float surfaceNoise = grain(floor(vSurfaceP * ${frequency}));
      diffuseColor.rgb *= 1.0 - (surfaceNoise * ${kind === 'plaster' ? '.055' : '.025'}) * ${amount.toFixed(2)};`);
    shader.fragmentShader = shader.fragmentShader.replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
      roughnessFactor = clamp(roughnessFactor + (surfaceNoise - .5) * .11, .06, 1.);`);
  };
  material.customProgramCacheKey = () => `studio-${kind}-${amount}`;
  return material;
}

export function bevelBox(w, h, d, r = .025) {
  r = Math.min(r, w / 3, h / 3, d / 3);
  const geometry = new T.BoxGeometry(w, h, d, 6, 6, 6);
  const positions = geometry.attributes.position;
  const p = new T.Vector3(), core = new T.Vector3(), delta = new T.Vector3();
  for (let i = 0; i < positions.count; i++) {
    p.fromBufferAttribute(positions, i);
    core.set(T.MathUtils.clamp(p.x, -w/2+r, w/2-r), T.MathUtils.clamp(p.y, -h/2+r, h/2-r), T.MathUtils.clamp(p.z, -d/2+r, d/2-r));
    delta.copy(p).sub(core).normalize().multiplyScalar(r);
    p.copy(core).add(delta); positions.setXYZ(i, p.x, p.y, p.z);
  }
  geometry.computeVertexNormals(); return geometry;
}

export function studioReflections(renderer) {
  const environment = new T.Scene();
  environment.background = new T.Color('#b4ada1');
  const panel = (w,h,color,intensity,x,y,z,ry=0) => {
    const m = new T.Mesh(new T.PlaneGeometry(w,h), new T.MeshBasicMaterial({color, side:T.DoubleSide}));
    m.material.color.multiplyScalar(intensity); m.position.set(x,y,z); m.rotation.y=ry; environment.add(m);
  };
  panel(5,5,'#fff4dc',4,-5,3,0,Math.PI/2);
  panel(3,5,'#dbeaf5',2.2,5,2,-2,-Math.PI/2);
  panel(8,2,'#fbf7ec',1.5,0,6,-5);
  const pmrem = new T.PMREMGenerator(renderer);
  const target = pmrem.fromScene(environment, .05, .1, 30);
  environment.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
  pmrem.dispose(); return target.texture;
}

// Derive non-colour surface response from the same photographed-style texture.
// These are material data maps, never replacement scene screenshots.
const surfaceSources=new Map();
export function loadSurface(url, { repeat = [1,1], relief = .003, roughness = .75, color = true } = {}, ready) {
  const materials = [];
  let maps;
  const apply = material => {
    if (maps) {
      if(color) material.map=maps.albedo;
      material.bumpMap=maps.height;
      material.bumpScale=relief;
      material.roughnessMap=maps.roughness;
      material.roughness=roughness;
      if(!color){
        material.onBeforeCompile=shader=>{
          shader.uniforms.paperAlbedo={value:maps.albedo};
          shader.fragmentShader='uniform sampler2D paperAlbedo;\n'+shader.fragmentShader;
          shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\ndiffuseColor.rgb *= mix(vec3(1.),texture2D(paperAlbedo,vMapUv).rgb,.55);');
        };
        material.customProgramCacheKey=()=> 'studio-printed-paper';
      }
      material.needsUpdate=true;
    }
    return material;
  };
  if(!surfaceSources.has(url))surfaceSources.set(url,new Promise((resolve,reject)=>new T.TextureLoader().load(url, albedo => {
    const c=document.createElement('canvas');c.width=c.height=1024;
    const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(albedo.image,0,0,1024,1024);
    const pixels=ctx.getImageData(0,0,1024,1024);
    const height=new Uint8Array(1024*1024*4), rough=new Uint8Array(height.length);
    for(let i=0;i<height.length;i+=4){
      const value=pixels.data[i]*.2126+pixels.data[i+1]*.7152+pixels.data[i+2]*.0722;
      height[i]=height[i+1]=height[i+2]=value;height[i+3]=255;
      rough[i]=rough[i+1]=rough[i+2]=Math.min(255,190+value*.24);rough[i+3]=255;
    }
    const h=new T.DataTexture(height,1024,1024),r=new T.DataTexture(rough,1024,1024);
    h.flipY=r.flipY=true;albedo.colorSpace=T.SRGBColorSpace;
    resolve({albedo,height:h,roughness:r});
  },undefined,reject)));
  surfaceSources.get(url).then(source=>{
    maps={albedo:source.albedo.clone(),height:source.height.clone(),roughness:source.roughness.clone()};
    for(const tex of Object.values(maps)){tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.repeat.set(...repeat);tex.anisotropy=8;tex.minFilter=T.LinearMipmapLinearFilter;tex.magFilter=T.LinearFilter;tex.generateMipmaps=true;tex.needsUpdate=true;}
    materials.forEach(apply);ready?.();
  }).catch(error=>console.warn('Studio material unavailable:',url,error));
  return material=>{materials.push(material);return apply(material);};
}

// Low-frequency contact occlusion complements the directional shadow map.
export function contactShadow(scene, x, y, z, width, depth, opacity = .2) {
  const material=new T.ShaderMaterial({
    transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,
    uniforms:{opacity:{value:opacity}},
    vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'varying vec2 vUv;uniform float opacity;void main(){vec2 p=abs(vUv-.5)*2.;float a=(1.-smoothstep(.35,1.,p.x))*(1.-smoothstep(.35,1.,p.y));gl_FragColor=vec4(.10,.075,.045,a*opacity);}'
  });
  const plane=new T.Mesh(new T.PlaneGeometry(width,depth),material);
  plane.rotation.x=-Math.PI/2;plane.position.set(x,y,z);plane.renderOrder=1;scene.add(plane);
}

// Static props sharing a surface render together, preserving world-space geometry.
export function batchStatic(scene, excluded = []) {
  const skip=new Set(excluded),batches=new Map();scene.updateMatrixWorld(true);
  scene.traverse(o=>{
    if(!o.isMesh||skip.has(o)||Array.isArray(o.material)||o.material.transparent||o.material.onBeforeCompile.toString().includes('vSurfaceP'))return;
    const key=`${o.material.uuid}:${o.castShadow}:${o.receiveShadow}`;
    if(!batches.has(key))batches.set(key,[]);batches.get(key).push(o);
  });
  for(const list of batches.values()){
    if(list.length<2)continue;
    const parts=list.map(o=>{const g=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();g.applyMatrix4(o.matrixWorld);return g;});
    const merged=new T.BufferGeometry();
    for(const name of ['position','normal','uv']){
      if(!parts.every(g=>g.attributes[name]))continue;
      const size=parts[0].attributes[name].itemSize;
      const array=new Float32Array(parts.reduce((n,g)=>n+g.attributes[name].array.length,0));let offset=0;
      for(const g of parts){array.set(g.attributes[name].array,offset);offset+=g.attributes[name].array.length;}
      merged.setAttribute(name,new T.BufferAttribute(array,size));
    }
    merged.computeBoundingSphere();const mesh=new T.Mesh(merged,list[0].material);
    mesh.castShadow=list[0].castShadow;mesh.receiveShadow=list[0].receiveShadow;scene.add(mesh);
    list.forEach(o=>o.removeFromParent());parts.forEach(g=>g.dispose());
  }
}
