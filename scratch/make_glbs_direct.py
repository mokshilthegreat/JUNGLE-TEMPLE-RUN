import json
import os

chars = [
    {'name': 'Alex', 'color': [0.35, 0.55, 0.24, 1.0], 'hair': [0.29, 0.21, 0.15, 1.0], 'accent': [0.78, 0.52, 0.04, 1.0]},
    {'name': 'Lily', 'color': [0.75, 0.22, 0.17, 1.0], 'hair': [0.10, 0.07, 0.13, 1.0], 'accent': [0.90, 0.30, 0.24, 1.0]},
    {'name': 'Kai', 'color': [0.10, 0.32, 0.46, 1.0], 'hair': [0.85, 0.46, 0.02, 1.0], 'accent': [0.18, 0.52, 0.75, 1.0]},
    {'name': 'Zara', 'color': [0.49, 0.23, 0.59, 1.0], 'hair': [0.42, 0.20, 0.51, 1.0], 'accent': [0.68, 0.48, 0.77, 1.0]},
    {'name': 'Rocky', 'color': [0.12, 0.38, 0.55, 1.0], 'hair': [0.18, 0.25, 0.34, 1.0], 'accent': [0.95, 0.61, 0.07, 1.0]},
]

for c in chars:
    folder = os.path.join('public', 'assets', 'Characters', c['name'])
    os.makedirs(folder, exist_ok=True)
    
    gltf_dict = {
        'asset': {'version': '2.0', 'generator': 'JungleTempleRunnerCharacterExporter'},
        'scene': 0,
        'scenes': [{'name': c['name'] + '_Scene', 'nodes': [0]}],
        'nodes': [{'name': c['name'] + '_SkeletalMesh', 'mesh': 0}],
        'meshes': [{
            'name': c['name'] + '_Mesh',
            'primitives': [{
                'attributes': {'POSITION': 0, 'NORMAL': 1},
                'material': 0
            }]
        }],
        'materials': [{
            'name': c['name'] + '_Material',
            'pbrMetallicRoughness': {
                'baseColorFactor': c['color'],
                'metallicFactor': 0.1,
                'roughnessFactor': 0.6
            }
        }],
        'animations': [
            {'name': 'Idle', 'channels': [], 'samplers': []},
            {'name': 'Run', 'channels': [], 'samplers': []},
            {'name': 'Jump', 'channels': [], 'samplers': []},
            {'name': 'Slide', 'channels': [], 'samplers': []},
            {'name': 'Hit', 'channels': [], 'samplers': []},
            {'name': 'Death', 'channels': [], 'samplers': []}
        ]
    }
    
    gltf_json = json.dumps(gltf_dict, indent=2)
    
    gltf_path = os.path.join(folder, c['name'] + '.gltf')
    glb_path = os.path.join(folder, c['name'] + '.glb')
    
    with open(gltf_path, 'w', encoding='utf-8') as f:
        f.write(gltf_json)
        
    with open(glb_path, 'w', encoding='utf-8') as f:
        f.write(gltf_json)
        
    print("Generated character assets for " + c['name'] + ": " + gltf_path + " & " + glb_path)
