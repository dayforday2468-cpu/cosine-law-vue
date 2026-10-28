function validateFormat(format) {
  const { exponentBits, fractionBits } = format

  if (!Number.isInteger(exponentBits) || exponentBits < 2 || exponentBits > 8) {
    throw new Error('exponentBits must be an integer between 2 and 8.')
  }

  if (!Number.isInteger(fractionBits) || fractionBits < 1 || fractionBits > 23) {
    throw new Error('fractionBits must be an integer between 1 and 23.')
  }

  const count = (2 ** exponentBits - 1) * 2 ** fractionBits - 1

  if (!Number.isSafeInteger(count)) {
    throw new Error('The floating-point format is too large to index safely.')
  }
}

function integerToBits(value, length) {
  return Array.from(
    { length },
    (_, index) => Math.floor(value / 2 ** (length - index - 1)) % 2,
  )
}

export function getBias(format) {
  validateFormat(format)

  return 2 ** (format.exponentBits - 1) - 1
}

export function getPositiveFiniteCount(format) {
  validateFormat(format)

  return (2 ** format.exponentBits - 1) * 2 ** format.fractionBits - 1
}

export function getMaxFiniteValue(format) {
  validateFormat(format)

  const bias = getBias(format)
  const maxRawExponent = 2 ** format.exponentBits - 2
  const maxSignificand = 2 - 2 ** (-format.fractionBits)

  return maxSignificand * 2 ** (maxRawExponent - bias)
}

export function getMinFiniteValue(format) {
  return -getMaxFiniteValue(format)
}

export function indexToFloatingPoint(index, format) {
  validateFormat(format)

  if (!Number.isInteger(index)) {
    throw new Error('Floating-point index must be an integer.')
  }

  const positiveFiniteCount = getPositiveFiniteCount(format)

  if (index < -positiveFiniteCount || index > positiveFiniteCount) {
    throw new Error('Floating-point index is outside the finite range.')
  }

  const exponentScale = 2 ** format.exponentBits
  const fractionScale = 2 ** format.fractionBits
  const bias = getBias(format)

  if (index === 0) {
    return {
      kind: 'zero',
      value: 0,
      signBit: 0,
      rawExponent: 0,
      fractionInteger: 0,
      unbiasedExponent: null,
      significand: 0,
      exponentBits: integerToBits(0, format.exponentBits),
      fractionBits: integerToBits(0, format.fractionBits),
    }
  }

  const signBit = index < 0 ? 1 : 0
  const rank = Math.abs(index)
  const subnormalCount = fractionScale - 1

  let kind
  let rawExponent
  let fractionInteger

  if (rank <= subnormalCount) {
    kind = 'subnormal'
    rawExponent = 0
    fractionInteger = rank
  } else {
    kind = 'normal'

    const normalOffset = rank - subnormalCount - 1

    rawExponent = 1 + Math.floor(normalOffset / fractionScale)
    fractionInteger = normalOffset % fractionScale
  }

  if (rawExponent === exponentScale - 1) {
    throw new Error('The all-ones exponent pattern is reserved for Infinity and NaN.')
  }

  const unbiasedExponent =
    kind === 'subnormal'
      ? 1 - bias
      : rawExponent - bias

  const significand =
    kind === 'subnormal'
      ? fractionInteger / fractionScale
      : 1 + fractionInteger / fractionScale

  const sign = signBit === 1 ? -1 : 1
  const value = sign * significand * 2 ** unbiasedExponent

  return {
    kind,
    value,
    signBit,
    rawExponent,
    fractionInteger,
    unbiasedExponent,
    significand,
    exponentBits: integerToBits(rawExponent, format.exponentBits),
    fractionBits: integerToBits(fractionInteger, format.fractionBits),
  }
}

export function formatFloatingPointValue(value) {
  if (Object.is(value, -0) || value === 0) {
    return '0'
  }

  const absoluteValue = Math.abs(value)

  if (absoluteValue >= 1e6 || absoluteValue < 1e-4) {
    return value
      .toExponential(6)
      .replace(/\.0+(?=e)/, '')
      .replace(/(\.\d*?[1-9])0+(?=e)/, '$1')
  }

  return Number(value.toPrecision(10)).toString()
}
