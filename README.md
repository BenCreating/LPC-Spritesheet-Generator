# LPC Spritesheet Generator

A browser app for generating spritesheets for [Liberated Pixel Cup](https://lpc.opengameart.org) characters.

[Try it out here.](https://bencreating.github.io/LPC-Spritesheet-Generator/)

## Licensing and Attribution

The code is available under the [MIT license](LICENSE).

Specific license details for each image varies, but all images are licensed under at least one of: [CC-BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/), [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), [OGA-BY 3.0](https://opengameart.org/content/oga-by-30-faq), [GPL 3.0](https://www.gnu.org/licenses/gpl-3.0.en.html), or a more permissive license. Licensing details for each item are in `sheet-definitions.json`.

## Adding items to the generator

### Spritesheets

#### Folder Structure and Naming

Each spritesheet should be split into individual animations (walk, cast, idle, etc.) and should be stored in `./resources/spritesheets/category/item/animation.png`

For example, the male character base is in the category `body`, so the paths to the `walk`, `cast`, and `idle` animations would be:
`./resources/spritesheets/body/male/walk.png`
`./resources/spritesheets/body/male/cast.png`
`./resources/spritesheets/body/male/idle.png`

#### Sheet Definitions

Every new item must also be added to the file `./resources/sheet-definitions.json`.

The sheet definitions is structured as nested JSON objects, following the pattern `category` > `item` > `item options`.

```json
{
  "body": {
    "male": {},
    "female": {}
  },

  "category2": {

  }
}
```

The options for the male character base (for brevity, the authors and licenses are limited to those for the cast, thrust, walk, slash, shoot, and hurt animations) would look like this:

```json
{
  "default": true,
  "tags": [
    "male",
    "adult"
  ],
  "excluded-by": [],
  "palettes": [
    "skin",
    "eyes"
  ],
  "authors": [
    "Stephen Challener (Redshrike)",
    "Johannes Sjölund (wulax)"
  ],
  "licenses": [
    "CC-BY-SA 3.0",
    "GPL 3.0"
  ],
  "links": [
    "https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles",
    "https://opengameart.org/content/lpc-medieval-fantasy-character-sprites"
  ]
}
```

- `default` (optional) sets if this is the default option for the category. If multiple items are set as the default the first will be used. If this is not set for any item in the category it will default to "none"
- `tags` (optional) used with excluded-by to hide incompatible items
- `excluded-by` (optional) a list of tags. If it includes any tags on selected items then this item will not appear as an option
- `palettes` (optional) the palette-definitions key for each palette used by the image. If it is left blank then the item will not be recolorable. List multiple palettes if the item has multiple recolorable pieces (a shirt with stripes, helmet with a feather, etc.)
- `authors` (required) a list of everyone who contributed to creating this item
- `licenses` (required) a list of every license the authors applied to the item
- `links` (required) a list of links to the item's source. It should include at least a link to the item's Open Game Art page

### Color Palettes

Color options should be added to `./resources/palette-definitions.json`

The key for each palette should be the name of the palette. The value is an array of color ramps.

Each color ramp is an array of color hexcodes. The first color will be the fill color for the button in the UI, and the second will be the border. The first color ramp is the default for that palette.

Images should be use the first color ramp of any palette they use. The do not need to include *all* the colors, but **only colors listed in the first color ramp will be recolored.**

A truncated example of the palette definitions:

```json
{
  "skin": [
    ["#faece7", "#f9d5ba", "#e4a47c", "#cc8665", "#99423c", "#271920"],
    ["#deac9b", "#d68c61", "#a96b4c", "#895b4a", "#593636", "#2a1722"],
    ["#714535", "#603429", "#442725", "#2e1f1c", "#1a1213", "#050606"]
  ],
  "hair": [
    ["#ff8a00", "#e55600", "#bf4000", "#a42600", "#6a1108", "#260d14"],
    ["#714535", "#603429", "#442725", "#2e1f1c", "#1a1213", "#050606"]
  ],
  "cloth": [
    ["#ffffff", "#e5e6ca", "#c2b5a1", "#928181", "#25171e"],
    ["#70d0de", "#57abbf", "#408295", "#244d6f", "#25171e"]
  ]
}
```

## Running locally

This should work with any recent version of Node, but has been tested on the version specified by the [.node-version file](/.node-version).

```
npm install
npm start
```

You should then be able to visit http://localhost:8080.

To run the server on a different port:

```
npm start -- --port 4000
```
