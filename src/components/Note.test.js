import React from 'react'

import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Note from './Note'


// test block via jest. per convention test files are in same
//                      directory as component being tested
//                      some ppl say all tests should be in their own dir
test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const component = render(
    <Note note={note} />
  )
  const li = component.container.querySelector('li')
  // component.debug()
  console.log(prettyDOM(li))

  // 1 finds matching text in HTML
  expect(component.container).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )

  // 2 searches for element with matching text
  const element = component.getByText(
    'Component testing is done with react-testing-library'
  )
  expect(element).toBeDefined()

  // 3 find specific rendered element by CSS selector, then checks text
  const div = component.container.querySelector('.note')
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )

})

test('clicking the button calls event handler once', () => {
    const note = {
      content: 'Component testing is done with react-testing-library',
      important: true
    }
  
    const mockHandler = jest.fn()
  
    const { getByText } = render(
      <Note note={note} toggleImportance={mockHandler} />
    )
  
    const button = getByText('make not important')
    fireEvent.click(button)
  
    expect(mockHandler.mock.calls.length).toBe(1)
  })