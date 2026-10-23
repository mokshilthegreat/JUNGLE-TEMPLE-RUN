import os

with open('src/engine/TrackManager3D.ts', 'r', encoding='utf-8') as f:
    t = f.read()
t = t.replace("private woodMat: THREE.MeshStandardMaterial;\n", "")
t = t.replace("this.woodMat = new THREE.MeshStandardMaterial({ color: '#4A2E14', roughness: 0.8 });\n", "")
with open('src/engine/TrackManager3D.ts', 'w', encoding='utf-8') as f:
    f.write(t)

with open('src/engine/GameEngine3D.ts', 'r', encoding='utf-8') as f:
    e = f.read()

e = e.replace("this.powerUpTimer = 10;", "")
e = e.replace("private powerUpTimer: number = 10;\n", "")
with open('src/engine/GameEngine3D.ts', 'w', encoding='utf-8') as f:
    f.write(e)

print('Unused variables cleaned up!')
