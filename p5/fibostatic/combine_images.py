from PIL import Image

IMAGE_SIZE = 672
NIMAGES = 360
SHAPEX, SHAPEY = 18, 20
WIDTH = SHAPEX * IMAGE_SIZE
HEIGHT = SHAPEY * IMAGE_SIZE

im = Image.new("RGBA", (WIDTH, HEIGHT))

for img_id in range(1, NIMAGES + 1):
    image = Image.open(f'images/fibo{img_id}.png')
    row, col = divmod(img_id, SHAPEX)
    im.paste(image, (col * IMAGE_SIZE, row * IMAGE_SIZE, ))

im.save('poster.png', 'png')