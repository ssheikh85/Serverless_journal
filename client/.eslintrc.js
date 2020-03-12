module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'graphql'],
  rules: {
    'graphql/template-strings': [
      'error',
      {
        schemaJsonFilepath: path.resolve(__dirname, './schema.json'),
        tagName: 'gql',
      },
    ],
  },
};
