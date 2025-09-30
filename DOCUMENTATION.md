# Development Documentation and Guidelines for this project

# Topics
- [Adding to Renderer](#adding-things-to-renderer)
- [Time/update based mechanics](#timeupdate-based-mechanics)
- [Working with resize system](#working-with-u-and-v-in-resize)
- [Creating new views](#creating-views)
- [Sprites and Audio](#sprites-and-audio)
- [Adding Text Notifications](#adding-text-notifications-to-your-interactions)


## Adding things to Renderer
- Add/remove objects to renderer via global object `R`'s `add` and `remove` methods
    - <b>NOTE:</b> `R.add` can take a [z-index](https://developer.mozilla.org/en-US/docs/Web/CSS/z-index) as the second argument. If z-indexes are not properly set, your objects may be behind each other and/or the background. This makes it seem like they aren't rendering, but you may just need to set z-index

- Renderer will automatically handle calling `update(dt)` and `draw()` for every object

## Time/update based mechanics
- `draw` and `update` will be called as many times as it can per second, if you want real-time based mechanics, you need to use `update` properly
- The `dt` parameter of update is the exact amount of seconds that have passed since the last frame was drawn
- This should be used for position updates (for animations or moving objects) and other kinds of timers.
- See `src/components/TextNotification.js` for a good example
    - Uses `dt` to increment a timer (real seconds) that tracks the fading time for each notification

## Working with U and V in Resize
- Our Virtual Coordinate system works by dynamically computing two numbers: `u` and `v`
    - `u` and `v` are the scale conversion from virtual coordinate unites (0-16 horizontally, 0-9 vertically) to X and Y coordinates
    - As the programmer, you will specify the position using the virtual coordinate units in the ranges above, and multiply them by `u` or `v` when you pass them into the p5.js drawing functions
    - e.g `rect(3 * u, 4 * v, 2 * u, 2 * v);`
- To get these conversion units, `const u = VM.u(), v = VM.v();` inside your draw

## Creating Views
- Each view must be its own class, and it inherits from `View` (see `src/views/ViewManager.js`)
- Your view's constructor must call View's constructor using `super(...)`
- Views can also have `OnEnter` and `OnExit` methods
    - These are called by the View Manager when entering and leaving a view.
    - Use this to add objects to renderer and eventually clean up when moving to another view 
    - See the NOTE under "Adding things to renderer" to avoid issues with z-index
- 
- <b>Placeholder/Generic/Test Objects</b>
    - TODO: add descriptions or link to what they are and which ones we have here

## Sprites and Audio
- For Sprite loading, we currently have a global sprite manager under the name `SM`
    - To preload a sprite, go into `src/core/SpriteManager.js`, and add your sprite using `SM.add(...)` under the `loadSprites` function
    - You can access this in your views using `SM.get('my_sprite_name')`


## Adding Text Notifications to your interactions
- The comments in `src/components/TextNotification.js` do a pretty good job of explaining this, but:
- To properly add a text notification to interactions for a view you must:
    - Create a `TextNotificationHandler` instance inside the constructor for your view
    - The view must implement a `update(dt)` function and call `TextNotificationHandler`'s `update(dt)` inside it (to update timers)
    - Make sure to call `TextNotificationHandler`'s `cleanup` in the onExit of the view
- Now you can send notifications to the screen by calling your handler's `add('texthere')` function 
- NOTE:
    - You can update the rate at which they fade in the handler's constructor
    - If they are not showing up or appearing beneath your objects, adjust z-index (also in constructor, default=100)