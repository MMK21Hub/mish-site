type ID = string

/** A reference to a single axis on a connected gamepad */
class PhysicalGamepadAxis {
  gamepad: Gamepad
  axisIndex: number
  constructor(gamepad: Gamepad, axisIndex: number) {
    this.gamepad = gamepad
    this.axisIndex = axisIndex
  }
  getValue() {
    return this.gamepad.axes[this.axisIndex]
  }
}

export abstract class PhysicalControl {
  // abstract id: ID
  abstract gamepad: Gamepad
}

class Physical2AxisControl extends PhysicalControl {
  // id: string
  gamepad: Gamepad
  xAxis: PhysicalGamepadAxis
  yAxis: PhysicalGamepadAxis
  constructor(gamepad: Gamepad, axisIndices: { x: number; y: number }) {
    super()
    this.gamepad = gamepad
    this.xAxis = new PhysicalGamepadAxis(gamepad, axisIndices.x)
    this.yAxis = new PhysicalGamepadAxis(gamepad, axisIndices.y)
  }
}

class PhysicalButtonControl extends PhysicalControl {
  gamepad: Gamepad
  button: GamepadButton
  constructor(gamepad: Gamepad, button: GamepadButton) {
    super()
    this.gamepad = gamepad
    this.button = button
  }
  isPressed() {
    return this.button.pressed
  }
}

/** A "logical" control on a gamepad. Not attached to any specific gamepad instance or layout. */
export abstract class Control {
  abstract id: ID
  abstract icon: string
  //  defaultColor
}

export class JoystickControl extends Control {
  id: string
  icon: string
  constructor(id: string, icon: string) {
    super()
    this.id = id
    this.icon = icon
  }
}

export class ButtonControl extends Control {
  id: string
  icon: string
  constructor(id: string, icon: string) {
    super()
    this.id = id
    this.icon = icon
  }
}

export abstract class Action {
  id: ID
  name: string
  constructor(id: ID, name: string) {
    this.id = id
    this.name = name
  }
  abstract onButtonStateChange(state: GamepadButton): void
  abstract onAxisChange(value: number): void
}

export interface PressEvent {
  type: "press" | "release"
}

export abstract class PressAction extends Action {
  protected abstract handleEvent(event: PressEvent): void
  onButtonStateChange(state: GamepadButton) {
    const event: PressEvent = {
      type: state.pressed ? "press" : "release",
    }
    this.handleEvent(event)
  }
  onAxisChange() {
    // ignore
  }
}

type GamepadControlMappings = {
  [id: string]: PhysicalControl
}

type ActionsRegistry = {
  [id: string]: Action
}

type ControlsRegistry = {
  [id: string]: Control
}

type ActionsToControlsMap = {
  [actionId: string]: Control
}

export class GamepadInputManager {
  actionsRegistry: ActionsRegistry
  controlsRegistry: ControlsRegistry
  actionsControls: ActionsToControlsMap
  controlMappings: GamepadControlMappings | undefined
  constructor(options: {
    actionsRegistry: ActionsRegistry
    controlsRegistry: ControlsRegistry
    actionsControls: ActionsToControlsMap
  }) {
    this.actionsRegistry = options.actionsRegistry
    this.controlsRegistry = options.controlsRegistry
    this.actionsControls = options.actionsControls
  }

  pollInput() {
    if (!this.controlMappings) return
    const controlMappings = this.controlMappings
    window.requestAnimationFrame(this.pollInput.bind(this))
    Object.entries(this.actionsControls).forEach(([actionId, control]) => {
      const action = this.actionsRegistry[actionId]
      if (!(control.id in controlMappings)) return
      const physicalControl =
        controlMappings[control.id as keyof typeof controlMappings]
      if (!physicalControl) return

      // Run the handler functions and let the actions decide what to do
      if (physicalControl instanceof PhysicalButtonControl) {
        action.onButtonStateChange(physicalControl.button)
      } else if (physicalControl instanceof Physical2AxisControl) {
        // TODO
      } else {
        throw new Error(`Unhandled control type for control ${control.id}`)
      }
    })
  }

  init() {
    window.addEventListener("gamepadconnected", (e) => {
      const gamepad = e.gamepad
      this.controlMappings = {
        left_joystick: new Physical2AxisControl(gamepad, {
          x: 0,
          y: 1,
        }),
        right_joystick: new Physical2AxisControl(gamepad, {
          x: 2,
          y: 3,
        }),
        bottom_face_button: new PhysicalButtonControl(
          gamepad,
          gamepad.buttons[0]
        ),
      }
      window.requestAnimationFrame(this.pollInput.bind(this))
    })
  }
}
