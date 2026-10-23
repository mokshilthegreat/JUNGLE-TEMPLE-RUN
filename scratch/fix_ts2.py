import os

with open('src/engine/TrackManager3D.ts', 'r', encoding='utf-8') as f:
    t = f.read()
t = t.replace("private pillarMat: THREE.MeshStandardMaterial;", "private pillarMat: THREE.MeshStandardMaterial;\n  private woodMat: THREE.MeshStandardMaterial;")
with open('src/engine/TrackManager3D.ts', 'w', encoding='utf-8') as f:
    f.write(t)

with open('src/engine/GameEngine3D.ts', 'r', encoding='utf-8') as f:
    e = f.read()
e = e.replace("private distanceSinceLastSpawn: number = 0;", "private distanceSinceLastSpawn: number = 0;\n  private powerUpTimer: number = 10;")
with open('src/engine/GameEngine3D.ts', 'w', encoding='utf-8') as f:
    f.write(e)

print('fix_ts2 completed!')
