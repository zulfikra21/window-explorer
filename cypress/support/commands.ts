declare namespace Cypress {
  interface Chainable {
    createFolder(name: string, options?: { parent?: boolean }): Chainable<void>
    searchFolders(query: string): Chainable<void>
    getFolderList(): Chainable<JQuery<HTMLElement>>
    findFolderItem(name: string): Chainable<JQuery<HTMLElement>>
  }
}

Cypress.Commands.add('createFolder', (name, options = {}) => {
  if (!options.parent) {
    cy.get('button:contains("+ Create Folder")').click()
    cy.get('.modal').should('be.visible')
  }
  cy.get('input[placeholder="Folder name"]').clear().type(name)
  cy.get('button:contains("Create")').click()
})

Cypress.Commands.add('searchFolders', (query) => {
  cy.get('input[placeholder="Search contents..."]').clear().type(query)
})

Cypress.Commands.add('getFolderList', () => {
  return cy.get('.folder-list')
})

Cypress.Commands.add('findFolderItem', (name) => {
  return cy.contains('.folder-item', name)
})
