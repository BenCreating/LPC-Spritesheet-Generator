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

Every new item must also have a definition file which should be stored in `./resources/sheet-definitions/category/item.json`. The path to the definition for the male character base is `./resources/sheet-definitions/body/male.json`.

The definitions are structured as JSON data. For the male character base they would look like this:

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
  "z_position": 25,
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
- `z_position` (optional) overrides the category's default z position
- `label` (optional) the label for the item in the option picker. Defaults to the name of the item. If a selection is made incompatible with the spritesheet (e.g. by switching from the male to female body) a compatible item with the same label will automatically activate if one is available in the same category. Both the label and item name will be included in the attribution.
- `authors` (required) a list of everyone who contributed to creating this item
- `licenses` (required) a list of every license the authors applied to the item
- `links` (required) a list of links to the item's source. It should include at least a link to the item's Open Game Art page

### Color Palettes

Color palettes also have definition files, which should be added to `./resources/palette-definitions`.

The file should be a JSON file named for the palette. The content is an array of color ramps.

Each color ramp is an array of color hexcodes. The first color will be the fill color for the button in the UI, and the second will be the border. The first color ramp is the default for that palette.

Images should use the first color ramp of any palette they use. The do not need to include *all* the colors, but **only colors listed in the first color ramp will be recolored.**

A truncated example of a palette definition:

```json
{
  [
    ["#faece7", "#f9d5ba", "#e4a47c", "#cc8665", "#99423c", "#271920"],
    ["#deac9b", "#d68c61", "#a96b4c", "#895b4a", "#593636", "#2a1722"],
    ["#714535", "#603429", "#442725", "#2e1f1c", "#1a1213", "#050606"]
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

If you add or modify a definition file you can recompile the merged definitions without restarting the server by running:

```
npm run merge-definitions
```
