// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import ButtonInput from '../Button/Button';
// import { IconButton } from 'react-native-paper';

// interface PaginationFooterProps {
//   currentPage: number;
//   totalRecords: number;
//   pageSize: number;
//   onPageChange: (newPage: number) => void;
// }

// const PaginationFooter: React.FC<PaginationFooterProps> = ({
//   currentPage,
//   totalRecords,
//   pageSize,
//   onPageChange,
// }) => {
//   const totalPages = Math.ceil(totalRecords / pageSize);

//   const renderPageNumbers = () => {
//     const pages: (number | string)[] = [];

//     if (totalPages <= 5) {
//       for (let i = 0; i < totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       pages.push(0);

//       if (currentPage > 2) {
//         pages.push('...');
//       }

//       let start = Math.max(1, currentPage - 1);
//       let end = Math.min(totalPages - 2, currentPage + 1);

//       for (let i = start; i <= end; i++) {
//         pages.push(i);
//       }

//       if (currentPage < totalPages - 3) {
//         pages.push('...');
//       }

//       pages.push(totalPages - 1);
//     }

//     return pages.map((page, index) =>
//       typeof page === 'number' ? (
//         <ButtonInput
//           key={index}
//           text={(page + 1).toString()}
//           onPress={() => onPageChange(page)}
//           buttonBackgroundColor={page === currentPage ? '#e0e0e0' : 'transparent'}
//           buttonFontColor={page === currentPage ? '#000' : '#333'}
//           width={40}
//           height={40}
//           fontSize={12}
//           fontWeight="bold"
//           styles={[
//             styles.pageButton,
//             {
//               backgroundColor: page === currentPage ? '#e0e0e0' : 'transparent',
//             },
//           ]}
//         />
//       ) : (
//         <Text key={index} style={styles.dots}>
//           {page}
//         </Text>
//       )
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <IconButton
//         icon="chevron-left"
//         size={20}
//         onPress={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 0}
//       />
//       {renderPageNumbers()}
//       <IconButton
//         icon="chevron-right"
//         size={20}
//         onPress={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages - 1}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 16,
//     marginTop: 20,
//     gap: 6,
//   },
//   pageButton: {
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//   },
//   dots: {
//     paddingHorizontal: 8,
//     fontSize: 14,
//     color: '#333',
//   },
// });

// export default PaginationFooter;

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface PaginationFooterProps {
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
}

const PaginationFooter: React.FC<PaginationFooterProps> = ({
  currentPage,
  totalRecords,
  pageSize,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalRecords / pageSize);

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0);

      if (currentPage > 2) {
        pages.push('...');
      }

      let start = Math.max(1, currentPage - 1);
      let end = Math.min(totalPages - 2, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push('...');
      }

      pages.push(totalPages - 1);
    }

    return pages.map((page, index) =>
      typeof page === 'number' ? (
        <TouchableOpacity
          key={index}
          onPress={() => onPageChange(page)}
          style={[
            styles.pageButton,
            page === currentPage && styles.activePageButton,
          ]}
        >
          <Text style={[styles.pageText, page === currentPage && styles.activePageText]}>
            {page + 1}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text key={index} style={styles.dots}>
          {page}
        </Text>
      )
    );
  };

  return (
    <View style={styles.container}>
      {/* Previous Button */}
      <TouchableOpacity
        disabled={currentPage === 0}
        onPress={() => onPageChange(currentPage - 1)}
        style={[
          styles.navButton,
          currentPage === 0 && styles.disabledNavButton,
        ]}
      >
        <Icon name="chevron-left" size={18} color={currentPage === 0 ? '#aaa' : '#333'} />
      </TouchableOpacity>

      {/* Page Number Buttons */}
      {renderPageNumbers()}

      {/* Next Button */}
      <TouchableOpacity
        disabled={currentPage === totalPages - 1}
        onPress={() => onPageChange(currentPage + 1)}
        style={[
          styles.navButton,
          currentPage === totalPages - 1 && styles.disabledNavButton,
        ]}
      >
        <Icon name="chevron-right" size={18} color={currentPage === totalPages - 1 ? '#aaa' : '#333'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom:30,
    gap: 6,
  },
  navButton: {
    minWidth: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: 'transparent',
  },
  disabledNavButton: {
    opacity: 0.5,
  },
  pageButton: {
    minWidth: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#aaa',
    backgroundColor: 'transparent',
  },
  activePageButton: {
    backgroundColor: '#e0e0e0',
  },
  pageText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  activePageText: {
    color: '#000',
  },
  dots: {
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#333',
  },
});

export default PaginationFooter;
