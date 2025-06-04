describe('Folder Management', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.intercept('GET', '/folders*').as('getFolders')
    cy.wait('@getFolders')
  })

   it('should allow creating new folders', () => {
    cy.get('button:contains("+ Create Folder")').click()
    cy.get('.modal').should('be.visible')
    
    // Test validation
    cy.get('input[placeholder="Folder name"]').type('  ')
       cy.get('button#create-folder').click()

    cy.contains('Folder name cannot be empty').should('be.visible')

    // Create valid folder
    cy.get('input[placeholder="Folder name"]').clear().type('Test Folder')
    cy.get('button#create-folder').click()
    cy.contains('Test Folder').should('be.visible')
  })

  it('should display root folders', () => {
    cy.get('.folder-item').should('exist')
    cy.contains('Select a folder to view its contents').should('be.visible')
  })

 

  it('should allow navigating folder hierarchy', () => {
    // First create a test folder
    cy.get('button:contains("+ Create Folder")').click()
    cy.get('input[placeholder="Folder name"]').type('Parent Folder')
          cy.get('button#create-folder').click()


    // Select the folder
    cy.contains('.folder-item', 'Parent Folder').click()
    cy.contains('Parent Folder Contents').should('be.visible')

    // Create child folder
        cy.get('#create-subdirectory-popup').click()

    cy.get('input[placeholder="Folder name"]').type('Child Folder')
          cy.get('#create-folder').click()

    cy.contains('.folder-item', 'Child Folder').should('be.visible')
  })

  it('should search folders', () => {
    // Create test folders
    cy.get('button:contains("+ Create Folder")').click()
    cy.get('input[placeholder="Folder name"]').type('Search Test 1')
             cy.get('#create-folder').click()


    cy.get('button:contains("+ Create Folder")').click()
    cy.get('input[placeholder="Folder name"]').type('Search Test 2')
    cy.get('#create-folder').click()


    // Test search
    cy.contains('.folder-item', 'Search Test 1').click()
    cy.get('input[placeholder="Search contents..."]').type('Test 1')
    cy.contains('Search Test 1').should('be.visible')
  })

  it('should show error for invalid search characters', () => {
    cy.contains('.folder-item', 'Search Test 1').click()
    cy.intercept('GET', '/folders?search*').as('searchFolders')

    cy.get('input[placeholder="Search contents..."]').type('<script>')
    cy.wait('@searchFolders').then((interception) => {
      expect(interception.response?.statusCode).to.equal(400)
    })
    cy.contains('Search query contains invalid characters').should('be.visible')
  })
})
