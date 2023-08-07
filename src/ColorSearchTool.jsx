import React, { useState, useEffect } from 'react';

function ColorSearchTool() {
  const [colors, setColors] = useState([]);
  const [inputColor, setInputColor] = useState('');
  const [sortedColors, setSortedColors] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/NishantChandla/color-test-resources/main/xkcd-colors.json');
      const data = await response.json();
      setColors(data.colors);
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
  };

  const handleInputChange = (event) => {
    setInputColor(event.target.value);
    setErrorMessage('');
  };

  const hexToRgb = (hex) => {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return { r, g, b };
  };

  const calculateColorDistance = (color1, color2) => {
    const rDiff = color1.r - color2.r;
    const gDiff = color1.g - color2.g;
    const bDiff = color1.b - color2.b;

    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
  };

  const validateColor = (inputHexColor) => {
    const validHexColorRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;
    return validHexColorRegex.test(inputHexColor);
  };

  const sortColorsBySimilarity = (inputHexColor) => {
    const inputRGB = hexToRgb(inputHexColor);

    const sorted = [...colors].sort((colorA, colorB) => {
      const distanceA = calculateColorDistance(inputRGB, hexToRgb(colorA.hex));
      const distanceB = calculateColorDistance(inputRGB, hexToRgb(colorB.hex));
      return distanceA - distanceB;
    });

    setSortedColors(sorted.slice(0, 100)); // Limit to top 100 results
  };

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      if (validateColor(inputColor)) {
        sortColorsBySimilarity(inputColor);
        setErrorMessage('');
      } else {
        setErrorMessage('Invalid color format. Please use a valid hex color code.');
      }
    }
  };

  return (
    <div className='p-10'>
      <h1 className='text-gray-800 text-3xl font-bold'>Color Searcher</h1>
      <h5 className='mt-8'>Colour</h5>
      <input
        className='my-1 p-2 border border-gray-800'
        type="text"
        placeholder="Enter Colour"
        value={inputColor}
        onChange={handleInputChange}
        onKeyDown={handleSearch}
      />
      <div style={{ color: 'red' }}>{errorMessage}</div>
      <table className='table-auto mt-4'>
        <thead>
          <tr>
            <th>Color</th>
            <th>Name</th>
            <th>Hex Code</th>
          </tr>
        </thead>
        <tbody>
          {sortedColors.map((color) => (
            <tr key={color.hex}>
              <td>
                <div
                  style={{
                    backgroundColor: color.hex,
                    width: '20px',
                    height: '20px',
                    display: 'inline-block'
                  }}
                />
              </td>
              <td>{color.color}</td>
              <td>{color.hex}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ColorSearchTool;
