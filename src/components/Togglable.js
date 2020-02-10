import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

// the component is wrapped in the forwardRef function to
// expose functions within the component to parent components
// using the useImperativeHandle hook
const Togglable = React.forwardRef((props, ref) => {
  // state which determines visibility of props.children
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  // access to this toggle function exposed thru ImperativeHandle
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {    
    return {      
        toggleVisibility    
    }  
  })
  
  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible} className="togglableContent">
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

export default Togglable