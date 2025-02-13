/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import Actions from "../views/Actions.js"
import '@testing-library/jest-dom/extend-expect'

describe('Étant donné que je suis connecté en tant qu\'Employé', () => {
  describe('Quand je suis sur la page des factures et qu\'il y a des factures', () => {
    test(('Alors, une icône en forme d\'œil devrait être affichée'), () => {
      const html = Actions()
      document.body.innerHTML = html
      expect(screen.getByTestId('icon-eye')).toBeTruthy()
    })
  })
  
  describe('Quand je suis sur la page des factures et qu\'elles ont une URL pour un fichier', () => {
    test(('Alors, l\'URL doit être enregistrée dans l\'attribut personnalisé data-bill-url'), () => {
      const url = '/fake_url'
      const html = Actions(url)
      document.body.innerHTML = html
      expect(screen.getByTestId('icon-eye')).toHaveAttribute('data-bill-url', url)
    })
  })
})
