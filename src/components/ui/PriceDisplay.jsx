import PropTypes from 'prop-types'

export function PriceDisplay({ price }) {
  if (!price) return null
  return (
    <span>
      {Number(price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
    </span>
  )
}

PriceDisplay.propTypes = { price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]) }
