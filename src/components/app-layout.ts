import { LitElement, css, html } from 'lit'

export class AppLayout extends LitElement {
  static properties = {
    title: { type: String }
  }

  declare title: string

  constructor() {
    super()
    this.title = 'My App'
  }

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      color: #222;
      background: #f7f7fb;
      font-family: sans-serif;
    }

    header {
      padding: 16px 24px;
      background: white;
      border-bottom: 1px solid #ddd;
      font-weight: 700;
    }

    main {
      padding: 24px;
    }
  `

  render() {
    return html`
      <header>${this.title}</header>
      <main>
        <slot></slot>
      </main>
    `
  }
}

customElements.define('app-layout', AppLayout)