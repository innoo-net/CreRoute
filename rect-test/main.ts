import { html, render } from 'lit'
import '../src/components/app-layout'

import { NodeEditor, ClassicPreset } from 'rete'
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin'
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin'
import { LitPlugin, Presets as LitPresets, type LitArea2D } from '@retejs/lit-plugin'

const app = document.querySelector<HTMLElement>('#app')
if (!app) throw new Error('#app が見つかりません')

render(
  html`
    <app-layout title="Rete Test">
      <div id="rete" style="width: 100%; height: 600px;"></div>
    </app-layout>
  `,
  app
)

queueMicrotask(() => {
  void createEditor()
})

class NumNode extends ClassicPreset.Node {
  constructor(label: string, socket: ClassicPreset.Socket) {
    super(label)
    this.addOutput('value', new ClassicPreset.Output(socket, 'Value'))
  }
}

class SumNode extends ClassicPreset.Node {
  constructor(socket: ClassicPreset.Socket) {
    super('Sum')
    this.addInput('a', new ClassicPreset.Input(socket, 'A'))
    this.addInput('b', new ClassicPreset.Input(socket, 'B'))
    this.addOutput('value', new ClassicPreset.Output(socket, 'Result'))
  }
}

type Schemes = {
  Node: NumNode | SumNode
  Connection: ClassicPreset.Connection<NumNode, SumNode> | ClassicPreset.Connection<NumNode, NumNode> | ClassicPreset.Connection<SumNode, SumNode> | ClassicPreset.Connection<SumNode, NumNode>
}

type AreaExtra = LitArea2D<Schemes>

async function createEditor() {
  const container = document.getElementById('rete')
  if (!(container instanceof HTMLElement)) {
    throw new Error('rete container not found')
  }

  const socket = new ClassicPreset.Socket('socket')

  const editor = new NodeEditor<Schemes>()
  const area = new AreaPlugin<Schemes, AreaExtra>(container)
  const connection = new ConnectionPlugin<Schemes, AreaExtra>()
  const renderPlugin = new LitPlugin<Schemes, AreaExtra>()

  renderPlugin.addPreset(LitPresets.classic.setup())
  connection.addPreset(ConnectionPresets.classic.setup())

  editor.use(area)
  area.use(connection)
  area.use(renderPlugin)

  AreaExtensions.simpleNodesOrder(area)

  const n1 = new NumNode('Number 1', socket)
  const n2 = new NumNode('Number 2', socket)
  const sum = new SumNode(socket)

  await editor.addNode(n1)
  await editor.addNode(n2)
  await editor.addNode(sum)

  await area.translate(n1.id, { x: 80, y: 120 })
  await area.translate(n2.id, { x: 80, y: 320 })
  await area.translate(sum.id, { x: 420, y: 220 })

  await editor.addConnection(new ClassicPreset.Connection(n1, 'value', sum, 'a'))
  await editor.addConnection(new ClassicPreset.Connection(n2, 'value', sum, 'b'))

  AreaExtensions.zoomAt(area, editor.getNodes())
}