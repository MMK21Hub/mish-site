type ID = string

/** A "logical" control on a gamepad. Not attached to any specific gamepad instance or layout. */
abstract class Control {
  abstract id: ID
  abstract icon: string
  //  defaultColor
}

class JoystickControl extends Control {
  id: string
  icon: string
  constructor(id: string, icon: string) {
    super()
    this.id = id
    this.icon = icon
  }
}

class ButtonControl extends Control {
  id: string
  icon: string
  constructor(id: string, icon: string) {
    super()
    this.id = id
    this.icon = icon
  }
}

export const controlsRegistry = {
  left_joystick: new JoystickControl(
    "left_joystick",
    "material-symbols:game-stick-left-outline"
  ),
  right_joystick: new JoystickControl(
    "right_joystick",
    "material-symbols:game-stick-right-outline"
  ),
  bottom_face_button: new ButtonControl(
    "bottom_face_button",
    "material-symbols:gamepad-circle-down"
  ),
}

export class Action {
  id: ID
  name: string

  constructor(id: ID, name: string) {
    this.id = id
    this.name = name
  }
}

export const actionsRegistry = {
  cursor_move: new Action("cursor_move", "Move cursor"),
  cursor_activate: new Action("cursor_activate", "Activate"),
}

export const actionsControls: {
  [id in keyof typeof actionsRegistry]: Control
} = {
  cursor_move: controlsRegistry["left_joystick"],
  cursor_activate: controlsRegistry["bottom_face_button"],
}

export function setupGamepadInput() {
  window.addEventListener("gamepadconnected", (e) => {
    console.log(
      "Gamepad connected at index %d: %s. %d buttons, %d axes.",
      e.gamepad.index,
      e.gamepad.id,
      e.gamepad.buttons.length,
      e.gamepad.axes.length
    )
  })
}
