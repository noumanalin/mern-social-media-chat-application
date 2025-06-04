import React from 'react'

interface TrimTextProps {
  text: string
  maxlength: number
}

const TrimText: React.FC<TrimTextProps> = ({ text, maxlength }) => {
  if (!text) return null
  
  return (
    <>
      {text.length > maxlength ? (
        <>
          {text.substring(0, maxlength)} <strong>Read More ...</strong>
        </>
      ) : (
        text
      )}
    </>
  )
}

export default TrimText