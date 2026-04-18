import { html, render } from 'lit'
import '../src/components/app-layout'

const app = document.querySelector<HTMLElement>('#app')

if (!app) throw new Error('#app が見つかりません')

render(
    html`
    <app-layout title="Test Page">
      <h1>Hello world</h1>
      <p>Vite + Lit のテストページです。</p>
    </app-layout>
  `,
    app
)