# Twitter Trends Japan

A web application that displays Twitter trends from Japan, with data stored in Firebase Firestore and updated daily.

## Features

- Display Twitter trends data from Firestore
- Update data once per day with caching
- Support for multiple languages (English/Japanese)
- Filter, sort, and search functionality
- Responsive design for mobile and desktop

## Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Update Firebase configuration in `src/services/firebase.js`
4. Run locally: `npm start`
5. Deploy to GitHub Pages: `npm run deploy`

## Data Structure

The application expects data in Firestore with the following structure:

- Collection: `trends`
- Documents with fields:
  - `originalTopic`: Original hashtag or topic in Japanese
  - `englishTranslation`: English translation of the topic
  - `whyTrending`: Brief explanation of why it's trending
  - `context`: Detailed background information
  - `timestamp`: Timestamp of when the trend was added
  - `trendScore`: Optional numeric score for popularity
  - `imageUrl`: Optional URL to an image
  - `links`: Optional array of related links
  - `tags`: Optional array of tags

## Future Enhancements

- Support for downloading images from links
- Adding tags for better categorization
- Full internationalization support
- Integration with iOS app

## License

MIT
