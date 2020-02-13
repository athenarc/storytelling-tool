import React, {useEffect, useState} from "react";
import {Document, Image, Page, PDFViewer, StyleSheet, Text, View} from "@react-pdf/renderer";
import {addToast, fetchData} from "../../utils";
import {ENDPOINT} from "../../config";
import {TOAST} from "../../resources";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row"
    // backgroundColor: "#D6D5D5"
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    display: "flex",
    alignItems: "center"
  },
  title: {
    fontSize: 24,
    marginBottom: 36
  },
  description: {
    fontSize: 14,
    lineHeight: 1.5
  },
  body: {
    fontSize: 12
  }
});

// Create Document Component
const StoryDocument = props => {
  const { story } = props;

  return (
    <Document title={story.title} author={story.createdBy.name}>
      <Page size="A4" style={styles.page}>
        <View style={[styles.section, { justifyContent: "center" }]}>
          <Text style={[styles.title]}>{story.title}</Text>
          <Text
            style={[
              styles.description,
              { textAlign: "center", padding: "0px 36px" }
            ]}
          >
            {story.description}
          </Text>
        </View>
      </Page>
      {story.chapters.map(chapter => {
        const imageUrl = chapter.assets[0] && chapter.assets[0].thumbnail;

        return (
          <Page key={chapter.id} size="A4" style={styles.page}>
            <View style={styles.section}>
              <Text style={styles.title}>{chapter.title}</Text>
              <Text style={[styles.description, { marginBottom: 36 }]}>
                {chapter.description}
              </Text>
              {imageUrl && (
                <Image
                  style={{ height: 300, width: 400 }}
                  src={{
                    // uri: "http://localhost:3000/static/media/brand.c2370cb7.png",
                    uri: imageUrl,
                    method: "GET",
                    headers: {},
                    body: ""
                  }}
                />
              )}
              <Text style={styles.body}>{chapter.name}</Text>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

const StoryPdfViewer = props => {
  const [story, setStory] = useState(null);
  const id = props.match.params.id;
  useEffect(() => {
    fetchData(ENDPOINT.STORIES + `/${id}`)
      .then(story => setStory(story))
      .catch(ex => addToast("Failed to preview story", TOAST.ERROR));
  }, [id]);

  return story ? (
    <PDFViewer style={{ flex: 1, height: "calc(100vh - 60px)", width: "100%" }}>
      <StoryDocument story={story} />
    </PDFViewer>
  ) : (
    <div>Loading</div>
  );
};

export default StoryPdfViewer;
