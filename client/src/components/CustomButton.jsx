import React from 'react'

const CustomButton = ({
  title,
  containerStyles,
  iconRight,
  type,
  onClick,
  disabled = false,
  isLoading = false,
}) => {
  return (
    <button
      onClick={onClick}
      type={type || 'button'}
      disabled={disabled}
      className={`inline-flex items-center justify-center ${containerStyles}`}
    >
      {isLoading ? (
        <span className='inline-flex items-center gap-2'>
          <span className='h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin'></span>
          {title}
        </span>
      ) : (
        <>
          {title}
          {iconRight && <div className='ml-2'>{iconRight}</div>}
        </>
      )}
    </button>
  )
}

export default CustomButton
