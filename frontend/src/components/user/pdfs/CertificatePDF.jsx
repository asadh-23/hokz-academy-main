import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import hokzAcademySignature from "../../../assets/icons/signature.png";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },

  container: {
    height: "100%",
    width: "100%",
  },

  outerBorder: {
    borderWidth: 6,
    borderColor: "#1a237e",
    borderStyle: "solid",
    height: "100%",
    width: "100%",
    padding: 20,
  },

  innerBorder: {
    borderWidth: 1,
    borderColor: "#c5a059",
    borderStyle: "solid",
    height: "100%",
    width: "100%",
    padding: 30,
    flexDirection: "column",
  },

  /* ---------- HEADER ---------- */
  header: {
    alignItems: "center",
    marginBottom: 18,
  },
  academyName: {
    fontSize: 24,
    color: "#1a237e",
    fontWeight: "bold",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  tagline: {
    fontSize: 10,
    color: "#c5a059",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 2,
  },

  /* ---------- TITLE ---------- */
  titleSection: {
    alignItems: "center",
    marginBottom: 22,
  },
  mainTitle: {
    fontSize: 40,
    color: "#1a237e",
    fontWeight: "bold",
    letterSpacing: 4,
    textTransform: "uppercase",
  },
  subTitle: {
    fontSize: 14,
    color: "#666666",
    fontStyle: "italic",
    letterSpacing: 1,
    marginTop: 2,
  },

  /* ---------- CONTENT ---------- */
  contentSection: {
    alignItems: "center",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  presentedText: {
    fontSize: 14,
    color: "#666666",
    fontStyle: "italic",
    marginBottom: 14,
  },
  studentName: {
    fontSize: 32,
    color: "#1a237e",
    fontWeight: "bold",
    textTransform: "capitalize",
    marginBottom: 16,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#c5a059",
    width: 280,
    textAlign: "center",
    alignSelf: "center",
  },
  achievementText: {
    fontSize: 12,
    color: "#444444",
    lineHeight: 1.6,
    marginBottom: 14,
    width: "75%",
  },
  courseName: {
    fontSize: 20,
    color: "#1a237e",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "bold",
    marginTop: 6,
  },

  /* ---------- FOOTER ---------- */
  footer: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingTop: 10,
  },

  footerBlock: {
    width: 160,
    alignItems: "center",
  },

  footerLine: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#333333",
    marginBottom: 4,
  },

  footerName: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1a237e",
    textAlign: "center",
  },

  footerTitle: {
    fontSize: 8,
    color: "#666666",
    textTransform: "uppercase",
    textAlign: "center",
    marginTop: 2,
  },

  signatureImage: {
    width: 90,
    height: 35,
    marginBottom: 4,
    objectFit: "contain",
  },

  sealContainer: {
    alignItems: "center",
  },
  seal: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#c5a059",
    alignItems: "center",
    justifyContent: "center",
  },
  sealText: {
    fontSize: 8,
    color: "#c5a059",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  sealMainText: {
    fontSize: 10,
    color: "#1a237e",
    fontWeight: "bold",
  },

  /* ---------- VERIFICATION ---------- */
  verification: {
    position: "absolute",
    bottom: 14,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: "#cccccc",
    paddingTop: 6,
  },
  verificationText: {
    fontSize: 8,
    color: "#888888",
  },
});

const CertificatePDF = ({
  studentName = "Student Name",
  courseName = "Full Stack Development",
  completionDate,
  score,
  instructorName = "Director, Hokz Academy",
  certificateId,
}) => {
  const formattedDate = new Date(completionDate || Date.now()).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  const certId =
    certificateId ||
    `CERT-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.outerBorder}>
            <View style={styles.innerBorder}>

              {/* HEADER */}
              <View style={styles.header}>
                <Text style={styles.academyName}>Hokz Academy</Text>
                <Text style={styles.tagline}>Excellence in Education</Text>
              </View>

              {/* TITLE */}
              <View style={styles.titleSection}>
                <Text style={styles.mainTitle}>Certificate</Text>
                <Text style={styles.subTitle}>of Completion</Text>
              </View>

              {/* CONTENT */}
              <View style={styles.contentSection}>
                <Text style={styles.presentedText}>This is to certify that</Text>
                <Text style={styles.studentName}>{studentName}</Text>
                <Text style={styles.achievementText}>
                  has successfully completed all requirements and demonstrated
                  exceptional proficiency in the professional certification course
                </Text>
                <Text style={styles.courseName}>{courseName}</Text>

                {typeof score === "number" && score >= 0 && (
                  <Text style={styles.scoreText}>
                    Final Score: {score}%
                  </Text>
                )}
              </View>

              {/* FOOTER */}
              <View style={styles.footer}>
                {/* DATE */}
                <View style={styles.footerBlock}>
                  <View style={styles.footerLine} />
                  <Text style={styles.footerName}>{formattedDate}</Text>
                  <Text style={styles.footerTitle}>Date of Completion</Text>
                </View>

                {/* SEAL */}
                <View style={styles.sealContainer}>
                  <View style={styles.seal}>
                    <Text style={styles.sealText}>Official</Text>
                    <Text style={styles.sealMainText}>HOKZ</Text>
                    <Text style={styles.sealText}>Academy</Text>
                  </View>
                </View>

                {/* SIGNATURE */}
                <View style={styles.footerBlock}>
                  <Image src={hokzAcademySignature} style={styles.signatureImage} />
                  <View style={styles.footerLine} />
                  <Text style={styles.footerName}>{instructorName}</Text>
                  <Text style={styles.footerTitle}>Authorized Signatory</Text>
                </View>
              </View>

              {/* VERIFICATION */}
              <View style={styles.verification}>
                <Text style={styles.verificationText}>Certificate ID: {certId}</Text>
                <Text style={styles.verificationText}>Issued: {formattedDate}</Text>
                <Text style={styles.verificationText}>
                  Verify: hokzacademy.com/verify
                </Text>
              </View>

            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CertificatePDF;
