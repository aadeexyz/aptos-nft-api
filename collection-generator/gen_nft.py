import random
import json
from PIL import Image

def generate(name, id, description):
    r = random.randint(0, 255)
    g = random.randint(0, 255)
    b = random.randint(0, 255)

    md = {
        'name': f'{name} #{id}',
        'description': description,
        'image': '...',
        'external_url': 'https://github.com/AadeeWasTaken',
        'attributes': [
            {
                'trait_type': 'Red',
                'value': r
            },
            {
                'trait_type': 'Green',
                'value': g
            },
            {
                'trait_type': 'Blue',
                'value': b
            }
        ]
    }

    img = Image.new('RGB', (100, 100), color = (r, g, b))
    img.save(f'img/{id}.png')

    with open(f'metadata/{id}.json', 'w') as f:
        json.dump(md, f, indent=4)


if __name__ == '__main__':
    number_of_nfts = 10
    name = 'Just NFT'
    description = 'This is just a NFT'

    for i in range(number_of_nfts):
        generate(name, i, description)
    
    print('Generated!')