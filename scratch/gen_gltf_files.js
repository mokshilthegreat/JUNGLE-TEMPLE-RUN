
if (typeof global.FileReader === 'undefined') {
  global.FileReader = class FileReader {
    readAsText(blob) {
      this.result = blob.toString();
      if (this.onload) this.onload();
    }
    readAsArrayBuffer(blob) {
      this.result = blob;
      if (this.onload) this.onload();
    }
  };
}

import fs from 'fs';
import path from 'path';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

const characters = [
  {
    id: 'char_alex',
    name: 'Alex',
    folder: 'Alex',
    isFemale: false,
    shirtColor: '#5B8C3E',
    pantsColor: '#6B4226',
    hairColor: '#4A3728',
    skinColor: '#D4A373',
    accentColor: '#C8860A',
    bootColor: '#221510',
    hatType: 'fedora'
  },
  {
    id: 'char_lily',
    name: 'Lily',
    folder: 'Lily',
    isFemale: true,
    shirtColor: '#C0392B',
    pantsColor: '#2C3E50',
    hairColor: '#1A1423',
    skinColor: '#E8A87C',
    accentColor: '#E74C3C',
    bootColor: '#900C3F',
    hatType: 'ponytail'
  },
  {
    id: 'char_kai',
    name: 'Kai',
    folder: 'Kai',
    isFemale: false,
    shirtColor: '#1A5276',
    pantsColor: '#154360',
    hairColor: '#D97706',
    skinColor: '#F0B27A',
    accentColor: '#2E86C1',
    bootColor: '#1B2631',
    hatType: 'shaman'
  },
  {
    id: 'char_zara',
    name: 'Zara',
    folder: 'Zara',
    isFemale: true,
    shirtColor: '#7D3C98',
    pantsColor: '#4A235A',
    hairColor: '#6C3483',
    skinColor: '#C39BD3',
    accentColor: '#AF7AC5',
    bootColor: '#281E5D',
    hatType: 'hood'
  },
  {
    id: 'char_rocky',
    name: 'Rocky',
    folder: 'Rocky',
    isFemale: false,
    shirtColor: '#1F618D',
    pantsColor: '#154360',
    hairColor: '#2E4057',
    skinColor: '#A9CCE3',
    accentColor: '#F39C12',
    bootColor: '#110905',
    hatType: 'helmet'
  }
];

function createCharacterScene(charDef) {
  const scene = new THREE.Scene();
  scene.name = charDef.name;

  const charGroup = new THREE.Group();
  charGroup.name = charDef.name + '_MeshGroup';

  const shirtMat = new THREE.MeshStandardMaterial({ color: charDef.shirtColor, roughness: 0.6 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: charDef.pantsColor, roughness: 0.7 });
  const hairMat = new THREE.MeshStandardMaterial({ color: charDef.hairColor, roughness: 0.8 });
  const skinMat = new THREE.MeshStandardMaterial({ color: charDef.skinColor, roughness: 0.5 });
  const accentMat = new THREE.MeshStandardMaterial({ color: charDef.accentColor, roughness: 0.4 });
  const bootMat = new THREE.MeshStandardMaterial({ color: charDef.bootColor, roughness: 0.8 });
  const darkLeather = new THREE.MeshStandardMaterial({ color: '#3E2723', roughness: 0.7 });
  const goldMat = new THREE.MeshStandardMaterial({ color: '#FFD700', metalness: 0.8, roughness: 0.2 });

  const torsoGroup = new THREE.Group();
  torsoGroup.name = 'TorsoGroup';

  const torsoW = charDef.isFemale ? 0.52 : 0.68;
  const torsoGeo = new THREE.BoxGeometry(torsoW, 0.85, 0.42);
  const torsoMesh = new THREE.Mesh(torsoGeo, shirtMat);
  torsoMesh.name = 'Torso';
  torsoMesh.position.y = 1.35;
  torsoGroup.add(torsoMesh);

  const vestGeo = new THREE.BoxGeometry(torsoW + 0.04, 0.8, 0.45);
  const vestMesh = new THREE.Mesh(vestGeo, accentMat);
  vestMesh.name = 'Vest';
  vestMesh.position.y = 1.35;
  torsoGroup.add(vestMesh);

  const beltGeo = new THREE.BoxGeometry(torsoW + 0.02, 0.12, 0.46);
  const beltMesh = new THREE.Mesh(beltGeo, darkLeather);
  beltMesh.name = 'Belt';
  beltMesh.position.y = 0.92;
  torsoGroup.add(beltMesh);

  const buckleGeo = new THREE.BoxGeometry(0.18, 0.15, 0.5);
  const buckleMesh = new THREE.Mesh(buckleGeo, goldMat);
  buckleMesh.name = 'Buckle';
  buckleMesh.position.set(0, 0.92, 0);
  torsoGroup.add(buckleMesh);

  // Head
  const headGroup = new THREE.Group();
  headGroup.name = 'HeadGroup';
  headGroup.position.y = 1.92;

  const headGeo = new THREE.SphereGeometry(0.23, 16, 16);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.name = 'Head';
  headGroup.add(headMesh);

  const hairGeo = new THREE.SphereGeometry(0.24, 12, 12, 0, Math.PI * 2, 0, Math.PI / 1.7);
  const hairMesh = new THREE.Mesh(hairGeo, hairMat);
  hairMesh.name = 'Hair';
  hairMesh.position.y = 0.02;
  headGroup.add(hairMesh);

  const hatGroup = new THREE.Group();
  hatGroup.name = 'HatGroup';

  if (charDef.hatType === 'fedora') {
    const brimGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.04, 16);
    const crownGeo = new THREE.CylinderGeometry(0.28, 0.3, 0.28, 16);
    crownGeo.translate(0, 0.15, 0);
    const brimMesh = new THREE.Mesh(brimGeo, accentMat);
    brimMesh.position.y = 0.18;
    hatGroup.add(brimMesh);
    const crownMesh = new THREE.Mesh(crownGeo, accentMat);
    crownMesh.position.y = 0.18;
    hatGroup.add(crownMesh);
  } else if (charDef.hatType === 'ponytail') {
    const ponyGeo = new THREE.CylinderGeometry(0.08, 0.04, 0.5, 8);
    ponyGeo.rotateX(Math.PI / 4);
    const ponyMesh = new THREE.Mesh(ponyGeo, hairMat);
    ponyMesh.position.set(0, 0.15, 0.25);
    hatGroup.add(ponyMesh);
  } else if (charDef.hatType === 'shaman') {
    const maskGeo = new THREE.BoxGeometry(0.4, 0.25, 0.3);
    const maskMesh = new THREE.Mesh(maskGeo, accentMat);
    maskMesh.position.set(0, 0.12, 0.08);
    hatGroup.add(maskMesh);
  } else if (charDef.hatType === 'hood') {
    const hoodGeo = new THREE.SphereGeometry(0.29, 12, 12, 0, Math.PI * 2, 0, Math.PI / 1.4);
    const hoodMesh = new THREE.Mesh(hoodGeo, accentMat);
    hoodMesh.position.y = 0.04;
    hatGroup.add(hoodMesh);
  } else if (charDef.hatType === 'helmet') {
    const helmGeo = new THREE.CylinderGeometry(0.27, 0.29, 0.22, 12);
    const helmMesh = new THREE.Mesh(helmGeo, accentMat);
    helmMesh.position.y = 0.14;
    hatGroup.add(helmMesh);
  }

  headGroup.add(hatGroup);
  torsoGroup.add(headGroup);

  const armRad = charDef.isFemale ? 0.07 : 0.09;
  const armX = charDef.isFemale ? 0.34 : 0.42;

  const armLeft = new THREE.Group();
  armLeft.name = 'ArmLeft';
  armLeft.position.set(-armX, 1.68, 0);
  const armGeoL = new THREE.CylinderGeometry(armRad, armRad * 0.9, 0.58, 8);
  armGeoL.translate(0, -0.29, 0);
  const armMeshL = new THREE.Mesh(armGeoL, shirtMat);
  armLeft.add(armMeshL);

  const armRight = new THREE.Group();
  armRight.name = 'ArmRight';
  armRight.position.set(armX, 1.68, 0);
  const armGeoR = new THREE.CylinderGeometry(armRad, armRad * 0.9, 0.58, 8);
  armGeoR.translate(0, -0.29, 0);
  const armMeshR = new THREE.Mesh(armGeoR, shirtMat);
  armRight.add(armMeshR);

  torsoGroup.add(armLeft);
  torsoGroup.add(armRight);

  const legX = charDef.isFemale ? 0.16 : 0.2;
  const legLeft = new THREE.Group();
  legLeft.name = 'LegLeft';
  legLeft.position.set(-legX, 0.9, 0);
  const legGeoL = new THREE.CylinderGeometry(0.11, 0.09, 0.7, 8);
  legGeoL.translate(0, -0.35, 0);
  const legMeshL = new THREE.Mesh(legGeoL, pantsMat);
  legLeft.add(legMeshL);

  const bootGeoL = new THREE.BoxGeometry(0.2, 0.2, 0.36);
  bootGeoL.translate(0, -0.7, -0.05);
  const bootMeshL = new THREE.Mesh(bootGeoL, bootMat);
  legLeft.add(bootMeshL);

  const legRight = new THREE.Group();
  legRight.name = 'LegRight';
  legRight.position.set(legX, 0.9, 0);
  const legGeoR = new THREE.CylinderGeometry(0.11, 0.09, 0.7, 8);
  legGeoR.translate(0, -0.35, 0);
  const legMeshR = new THREE.Mesh(legGeoR, pantsMat);
  legRight.add(legMeshR);
  const bootMeshR = new THREE.Mesh(bootGeoL, bootMat);
  legRight.add(bootMeshR);

  charGroup.add(torsoGroup);
  charGroup.add(legLeft);
  charGroup.add(legRight);

  scene.add(charGroup);

  const times = [0, 0.5, 1.0];
  const idleTrack = new THREE.VectorKeyframeTrack('TorsoGroup.position', times, [0, 0, 0, 0, 0.03, 0, 0, 0, 0]);
  const idleClip = new THREE.AnimationClip('Idle', 1.0, [idleTrack]);

  const runTrackL = new THREE.QuaternionKeyframeTrack('LegLeft.quaternion', times, [0, 0, 0, 1, 0.3, 0, 0, 0.95, 0, 0, 0, 1]);
  const runTrackR = new THREE.QuaternionKeyframeTrack('LegRight.quaternion', times, [0, 0, 0, 1, -0.3, 0, 0, 0.95, 0, 0, 0, 1]);
  const runClip = new THREE.AnimationClip('Run', 1.0, [runTrackL, runTrackR]);

  const jumpTrack = new THREE.VectorKeyframeTrack('TorsoGroup.position', [0, 0.4, 0.8], [0, 0, 0, 0, 1.5, 0, 0, 0, 0]);
  const jumpClip = new THREE.AnimationClip('Jump', 0.8, [jumpTrack]);

  const slideTrack = new THREE.VectorKeyframeTrack('TorsoGroup.position', [0, 0.3, 0.6], [0, 0, 0, 0, -0.4, 0, 0, 0, 0]);
  const slideClip = new THREE.AnimationClip('Slide', 0.6, [slideTrack]);

  const hitTrack = new THREE.VectorKeyframeTrack('TorsoGroup.position', [0, 0.2, 0.4], [0, 0, 0, -0.2, 0, 0, 0, 0, 0]);
  const hitClip = new THREE.AnimationClip('Hit', 0.4, [hitTrack]);

  const deathTrack = new THREE.VectorKeyframeTrack('TorsoGroup.position', [0, 0.5, 1.0], [0, 0, 0, 0, -0.8, 0, 0, -1.0, 0]);
  const deathClip = new THREE.AnimationClip('Death', 1.0, [deathTrack]);

  return { scene, animations: [idleClip, runClip, jumpClip, slideClip, hitClip, deathClip] };
}

function exportAllCharacters() {
  const exporter = new GLTFExporter();

  for (const charDef of characters) {
    const { scene, animations } = createCharacterScene(charDef);
    const outDir = path.join(process.cwd(), 'public', 'assets', 'Characters', charDef.folder);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    const outFileGltf = path.join(outDir, charDef.folder + '.gltf');
    const outFileGlb = path.join(outDir, charDef.folder + '.glb');

    exporter.parse(
      scene,
      (gltf) => {
        const jsonStr = JSON.stringify(gltf, null, 2);
        fs.writeFileSync(outFileGltf, jsonStr);
        fs.writeFileSync(outFileGlb, jsonStr);
        console.log('Saved ' + charDef.name + ' GLTF/GLB (' + (jsonStr.length / 1024).toFixed(1) + ' KB)');
      },
      (err) => console.error(err),
      { binary: false, animations: animations }
    );
  }
}

exportAllCharacters();
