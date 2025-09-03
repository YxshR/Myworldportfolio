# Earth Textures

This directory contains texture files for the premium Earth component.

## Current Status

The current texture files are minimal placeholder images generated programmatically. For a production-ready premium Earth experience, replace these files with high-quality textures:

## Recommended Texture Sources

### Earth Day Texture (`earth-day-16k.jpg`)
- **Source**: NASA Blue Marble or similar high-resolution Earth imagery
- **Resolution**: 16384x8192 pixels (16K)
- **Format**: JPG or PNG
- **Content**: Detailed Earth surface with crystal-clear continent boundaries, topographical features, and realistic colors

### Earth Night Texture (`earth-night-16k.jpg`)
- **Source**: NASA Earth at Night or similar night lights imagery
- **Resolution**: 16384x8192 pixels (16K)
- **Format**: JPG or PNG
- **Content**: Earth at night showing city lights, populated areas, and light pollution patterns

### Earth Bump Map (`earth-bump-8k.jpg`)
- **Source**: NASA topographical data or elevation maps
- **Resolution**: 8192x4096 pixels (8K)
- **Format**: JPG or PNG (grayscale)
- **Content**: Elevation data showing mountains, valleys, ocean depths, and surface relief

### Earth Normal Map (`earth-normal-8k.jpg`)
- **Source**: Generated from elevation data or NASA topographical maps
- **Resolution**: 8192x4096 pixels (8K)
- **Format**: JPG or PNG
- **Content**: Normal map data for enhanced surface detail and realistic lighting

## Implementation Details

The Earth component (`components/3d/Earth.tsx`) includes:

- **Premium scaling**: 2.5x larger than standard for maximum visual impact
- **High-detail geometry**: 128x128 sphere segments for smooth surface
- **Advanced materials**: Bump mapping, normal mapping, and realistic surface properties
- **Fallback system**: Procedural textures when high-quality files are unavailable
- **Atmospheric effects**: Subtle blue glow around Earth perimeter
- **Realistic rotation**: Accurate Earth rotation speed and animation

## Performance Considerations

- High-resolution textures (16K/8K) may impact performance on lower-end devices
- The component includes automatic fallback to procedural textures if loading fails
- Consider implementing texture compression and LOD (Level of Detail) for production use

## Usage

The Earth component is automatically included in the UniverseCanvas and will:
1. Attempt to load high-quality texture files
2. Fall back to procedural textures if files are unavailable or fail to load
3. Render with premium materials and lighting for realistic appearance