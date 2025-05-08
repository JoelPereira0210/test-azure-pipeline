import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { launchImageLibrary, Asset } from 'react-native-image-picker';

type Props = {
  selectedImage: string | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedImageData: React.Dispatch<React.SetStateAction<any>>;
};

const ProfileImageUpload = ({
  selectedImage,
  setSelectedImage,
  setSelectedImageData,
}: Props) => {
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  const handleImageUpload = async () => {
    setError('');
    setSelectedImageData(null);

    // Launch the native image library
    const result = await launchImageLibrary({
      mediaType: 'photo',
      // If you want base64 data, uncomment the line below:
      includeBase64: true,
    });

    // User cancelled the picker
    if (result.didCancel) {
      return;
    }

    if (result.assets && result.assets.length > 0) {
      const file: Asset = result.assets[0];

      // Check file size (fileSize is in bytes)
      const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
      if (file.fileSize && file.fileSize > maxSizeInBytes) {
        setError('Max image upload size is 5 MB');
        return;
      }

      // Save the raw file data so the parent can handle it
      setSelectedImageData([file]);

      // Show local image preview
      if (file.uri) {
        setImageUrl(file.uri);
        // Clear out the old base64 if you want to show the newly picked image
        setSelectedImage('');
      }

      // If you want base64 data for immediate usage:
      // if (file.base64) {
      //   setSelectedImage(file.base64);
      //   setImageUrl('');
      // }
    }
  };

  const displayImage = () => {
    // 1. If we have a base64 image from server (selectedImage),
    //    show that (as "already saved" or "existing" image).
    if (selectedImage) {
      return (
        <Image
          source={{ uri: `data:image/png;base64,${selectedImage}` }}
          style={styles.image}
        />
      );
    }
    // 2. Otherwise, if user just picked a local image (imageUrl),
    //    show that local image preview.
    if (imageUrl) {
      return <Image source={{ uri: imageUrl }} style={styles.image} />;
    }
    // 3. Fallback icon or placeholder if no image is set
    return (
      <View style={[styles.image, styles.placeholder]}>
        <Text style={styles.placeholderText}>No Image</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {displayImage()}

      {/* Make the entire area clickable to pick a new image */}
      <TouchableOpacity style={styles.touchArea} onPress={handleImageUpload} />

      {/* Show error if any */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default ProfileImageUpload;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 123,
    height: 94,
    marginTop: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 9999,
    resizeMode: 'cover',
  },
  placeholder: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
  },
  touchArea: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 8,
  },
});
