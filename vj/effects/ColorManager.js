class ColorManager {
  constructor() {
    // Keep all the color schemes here
    this.colorSchemes = [
      // --- Vibrant & High Contrast ---
      {
        name: 'Cyberpunk Neon',
        colors: ['#FF00FF', '#00FFFF', '#FFFF00', '#FF007F', '#666666'],
      },
      {
        name: 'Synthwave Sunset',
        colors: ['#FF48B0', '#FF764A', '#8A2BE2', '#4B0082', '#191970'],
      },
      {
        name: 'Glitch Red Cyan',
        colors: ['#FF0000', '#00FFFF', '#FFFFFF', '#888888', '#666666'],
      },
      {
        name: 'Toxic Green',
        colors: ['#00FF00', '#ADFF2F', '#FFFF00', '#2E2E2E', '#666666'],
      },
      {
        name: 'Electric Blue',
        colors: ['#0000FF', '#00BFFF', '#ADD8E6', '#FFFFFF', '#000033'],
      },
      {
        name: 'Rainbow Bright',
        colors: [
          '#FF0000',
          '#FF7F00',
          '#FFFF00',
          '#00FF00',
          '#0000FF',
          '#4B0082',
          '#9400D3',
        ],
      },
      {
        name: 'Candy Pop',
        colors: ['#FF69B4', '#87CEFA', '#FFFACD', '#98FB98', '#FFB6C1'],
      },
      {
        name: 'Fire & Ice',
        colors: [
          '#FF4500',
          '#FFD700',
          '#DC143C',
          '#00FFFF',
          '#4682B4',
          '#FFFFFF',
        ],
      },
      {
        name: 'Lazer Grid',
        colors: ['#DA70D6', '#00FA9A', '#FF00FF', '#1E90FF', '#666666'],
      },
      {
        name: 'Plasma Ball',
        colors: [
          '#FF00FF',
          '#EE82EE',
          '#DA70D6',
          '#BA55D3',
          '#8A2BE2',
          '#4B0082',
        ],
      },

      // --- Earth Tones & Natural ---
      {
        name: 'Forest Deep',
        colors: ['#006400', '#228B22', '#556B2F', '#8FBC8F', '#004000'],
      },
      {
        name: 'Desert Earth',
        colors: ['#A0522D', '#CD853F', '#F4A460', '#DEB887', '#8B4513'],
      },
      {
        name: 'Autumn Leaves',
        colors: [
          '#8B0000',
          '#DC143C',
          '#FF8C00',
          '#FFA500',
          '#FFD700',
          '#A0522D',
        ],
      },
      {
        name: 'Sandstone',
        colors: [
          '#F5F5DC',
          '#FFEBCD',
          '#FFE4C4',
          '#FFDEAD',
          '#CD853F',
          '#A0522D',
        ],
      },
      {
        name: 'Savanna Sunset',
        colors: ['#FF4500', '#FF6347', '#FF7F50', '#B22222', '#483C32'],
      },
      {
        name: 'Redwood Dawn',
        colors: ['#8B4513', '#A0522D', '#BC8F8F', '#CD5C5C', '#E9967A'],
      },
      {
        name: 'Moss & Stone',
        colors: ['#556B2F', '#6B8E23', '#808080', '#A9A9A9', '#2F4F4F'],
      },
      {
        name: 'Clay Pottery',
        colors: ['#B87333', '#CD853F', '#D2B48C', '#A0522D', '#F5F5DC'],
      },
      {
        name: 'Dried Herbs',
        colors: ['#6B8E23', '#BDB76B', '#ADFF2F', '#556B2F', '#F5F5DC'],
      },
      {
        name: 'Canyon Walls',
        colors: ['#CD5C5C', '#E9967A', '#FFA07A', '#BC8F8F', '#A0522D'],
      },

      // --- Muted & Atmospheric ---
      {
        name: 'Arctic Ice',
        colors: [
          '#FFFFFF',
          '#F0FFFF',
          '#ADD8E6',
          '#B0C4DE',
          '#778899',
          '#4682B4',
        ],
      },
      {
        name: 'Winter Sky',
        colors: ['#708090', '#778899', '#B0C4DE', '#E6E6FA', '#FFFFFF'],
      },
      {
        name: 'Deep Space',
        colors: [
          '#666666',
          '#000033',
          '#4B0082',
          '#8A2BE2',
          '#E6E6FA',
          '#FFFFFF',
        ],
      },
      {
        name: 'Industrial Grey',
        colors: [
          '#2F4F4F',
          '#708090',
          '#778899',
          '#A9A9A9',
          '#C0C0C0',
          '#FF7F50',
        ],
      },
      {
        name: 'Misty Mountain',
        colors: ['#B0C4DE', '#ADD8E6', '#F0FFFF', '#778899', '#696969'],
      },
      {
        name: 'Oceanic Blues',
        colors: [
          '#000080',
          '#0000CD',
          '#4169E1',
          '#00BFFF',
          '#AFEEEE',
          '#E0FFFF',
        ],
      },
      {
        name: 'Nebula Haze',
        colors: [
          '#4B0082',
          '#8A2BE2',
          '#9932CC',
          '#FF00FF',
          '#FF69B4',
          '#DB7093',
        ],
      },
      {
        name: 'Volcanic Ash',
        colors: [
          '#2F4F4F',
          '#696969',
          '#808080',
          '#A9A9A9',
          '#FF4500',
          '#B22222',
        ],
      },
      {
        name: 'Faded Pastel',
        colors: ['#FFDFD3', '#D3DFFF', '#DFFFD3', '#FFFDD3', '#FADADD'],
      },
      {
        name: 'Moonlit Night',
        colors: [
          '#000033',
          '#191970',
          '#483D8B',
          '#6A5ACD',
          '#E6E6FA',
          '#B0C4DE',
        ],
      },
    ];
    // No need to store currentPalette here anymore
  }

  // ★ Method to get a random palette (as p5.Color objects) and its name
  getRandomPalette() {
    const scheme = random(this.colorSchemes);
    const palette = scheme.colors.map((c) => color(c)); // Convert hex to p5.Color
    return { name: scheme.name, colors: palette };
  }
}
