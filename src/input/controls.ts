import {
  Action,
  ButtonControl,
  Control,
  JoystickControl,
  PhysicalControl,
  PressAction,
  type PressEvent,
} from "./gamepad"

class MoveCursor extends Action {
  constructor() {
    super("cursor_move", "Move cursor")
  }
  // TODO make this a 2-axis action
}
class Activate extends PressAction {
  constructor() {
    super("cursor_activate", "Activate")
  }
  protected handleEvent(event: PressEvent): void {
    console.log(`Cursor ${event.type}ed`)
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

export const actionsRegistry = {
  cursor_move: new MoveCursor(),
  cursor_activate: new Activate(),
}

type ActionsControls = {
  [id in keyof typeof actionsRegistry]: Control
}

export const actionsControls: ActionsControls = {
  cursor_move: controlsRegistry["left_joystick"],
  cursor_activate: controlsRegistry["bottom_face_button"],
}
