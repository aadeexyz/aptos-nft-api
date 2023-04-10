import json

def update(base_uri, id):
    with open(f'metadata/{id}.json', 'r') as f:
        md = json.load(f)
        md['image'] = f'{base_uri}/{id}.png'
    
    with open(f'metadata/{id}.json', 'w') as f:
        json.dump(md, f, indent=4)

if __name__ == '__main__':
    number_of_nfts = 10
    base_uri = 'ipfs://QmNanwP5N14mU16C7emk6AipZwF8jojc7JMxXFVih5yMwJ'
    cover_uri = 'ipfs://QmNanwP5N14mU16C7emk6AipZwF8jojc7JMxXFVih5yMwJ'

    for i in range(number_of_nfts):
        update(base_uri, i)

    with open('metadata/metadata.json', 'w') as f:
        md = {
            'name': 'Just NFTs',
            'symbol': 'JNFT',
            'description': 'This is just a NFT Collection',
            'image': cover_uri,
            'external_url': 'https://github.com/AadeeWasTaken',
            'total_supply': number_of_nfts,
        }

        json.dump(md, f, indent=4)