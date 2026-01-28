import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import hokzAcademySignature from "../../../assets/icons/signature.png";
// Professional Invoice Styles
const styles = StyleSheet.create({
  // Page Layout
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#2d3748',
    lineHeight: 1.6,
    backgroundColor: '#ffffff'
  },
  
  // Header Section
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#4f46e5'
  },
  
  // Company Branding
  companySection: {
    flex: 1
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4f46e5',
    marginBottom: 4,
    letterSpacing: 1
  },
  companyTagline: {
    fontSize: 11,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 8
  },
  companyAddress: {
    fontSize: 9,
    color: '#6b7280',
    lineHeight: 1.4
  },
  
  // Invoice Title Section
  invoiceSection: {
    alignItems: 'flex-end'
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8
  },
  invoiceSubtitle: {
    fontSize: 12,
    color: '#059669',
    fontWeight: 'bold',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4
  },
  
  // Invoice Meta Information
  metaSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    backgroundColor: '#f9fafb',
    padding: 20,
    borderRadius: 8
  },
  
  // Billing Information
  billingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30
  },
  billingColumn: {
    width: '48%'
  },
  billingHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4f46e5',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  billingName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4
  },
  billingDetails: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 2
  },
  
  // Table Styles
  table: {
    marginBottom: 20
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  tableHeaderText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    minHeight: 40,
    alignItems: 'center'
  },
  tableRowEven: {
    backgroundColor: '#f9fafb'
  },
  
  // Table Columns
  colIndex: {
    width: '8%',
    textAlign: 'center'
  },
  colDescription: {
    width: '62%',
    paddingRight: 8
  },
  colAmount: {
    width: '30%',
    textAlign: 'right'
  },
  
  // Course Details
  courseTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2
  },
  courseTutor: {
    fontSize: 9,
    color: '#6b7280'
  },
  coursePrice: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  
  // Summary Section
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  
  // Terms and Conditions
  termsSection: {
    width: '55%',
    paddingRight: 20
  },
  termsTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8
  },
  termItem: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 3,
    lineHeight: 1.4
  },
  
  // Totals Section
  totalsSection: {
    width: '40%',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    alignItems: 'center'
  },
  totalLabel: {
    fontSize: 10,
    color: '#6b7280'
  },
  totalValue: {
    fontSize: 10,
    color: '#1f2937',
    fontWeight: 'bold'
  },
  discountValue: {
    fontSize: 10,
    color: '#059669',
    fontWeight: 'bold'
  },
  
  // Grand Total
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#4f46e5',
    alignItems: 'center'
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4f46e5'
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4f46e5'
  },
  
  // Signature Section
  signatureSection: {
    marginTop: 30,
    alignItems: 'flex-end'
  },
  signatureText: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 8
  },
  signatureImage: {
    width: 80,
    height: 30,
    marginBottom: 8,
    objectFit: 'contain'
  },
  signatureName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1f2937',
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
    paddingTop: 8,
    paddingHorizontal: 20,
    textAlign: 'center'
  },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb'
  },
  footerText: {
    fontSize: 9,
    color: '#9ca3af'
  },
  footerWebsite: {
    fontSize: 9,
    color: '#4f46e5',
    fontWeight: 'bold',
    marginTop: 2
  }
});

const InvoicePDF = ({ orderData, courses, student }) => {
  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Generate invoice number
  const invoiceNumber = `INV-${orderData.razorpayOrderId?.slice(-8) || 'XXXXXXXX'}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.companySection}>
            <Text style={styles.companyName}>HOKZ ACADEMY</Text>
            <Text style={styles.companyTagline}>Empowering Minds, Building Futures</Text>
            <View style={{ marginTop: 8 }}>
              <Text style={styles.companyAddress}>Hokz Academy Private Limited</Text>
              <Text style={styles.companyAddress}>Cyber Park, Nellikode</Text>
              <Text style={styles.companyAddress}>Calicut, Kerala - 673016</Text>
              <Text style={styles.companyAddress}>GSTIN: 32ABCDE1234F1Z5</Text>
              <Text style={styles.companyAddress}>Email: billing@hokzacademy.com</Text>
              <Text style={styles.companyAddress}>Phone: +91 9876543210</Text>
            </View>
          </View>
          
          <View style={styles.invoiceSection}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceSubtitle}>PAID</Text>
          </View>
        </View>

        {/* Invoice Meta Information */}
        <View style={styles.metaSection}>
          <View>
            <Text style={styles.billingHeader}>Invoice Details</Text>
            <Text style={styles.billingDetails}>Invoice #: {invoiceNumber}</Text>
            <Text style={styles.billingDetails}>Date: {formatDate(orderData.createdAt)}</Text>
            <Text style={styles.billingDetails}>Payment ID: {orderData.razorpayPaymentId || 'N/A'}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.billingHeader}>Payment Information</Text>
            <Text style={styles.billingDetails}>Method: Razorpay</Text>
            <Text style={styles.billingDetails}>Status: Completed</Text>
            <Text style={styles.billingDetails}>Currency: INR</Text>
          </View>
        </View>

        {/* Billing Information */}
        <View style={styles.billingSection}>
          {/* Bill From */}
          <View style={styles.billingColumn}>
            <Text style={styles.billingHeader}>Bill From</Text>
            <Text style={styles.billingName}>Hokz Academy Pvt Ltd</Text>
            <Text style={styles.billingDetails}>Cyber Park, Nellikode</Text>
            <Text style={styles.billingDetails}>Calicut, Kerala - 673016</Text>
            <Text style={styles.billingDetails}>India</Text>
            <Text style={styles.billingDetails}>GST: 32ABCDE1234F1Z5</Text>
          </View>
          
          {/* Bill To */}
          <View style={styles.billingColumn}>
            <Text style={styles.billingHeader}>Bill To</Text>
            <Text style={styles.billingName}>
              {student?.fullName || orderData.studentName || 'Valued Student'}
            </Text>
            <Text style={styles.billingDetails}>{orderData.email}</Text>
            <Text style={styles.billingDetails}>
              {orderData.phone || student?.phone || 'Phone not provided'}
            </Text>
            <Text style={styles.billingDetails}>
              {orderData.address || student?.address || 'Address not provided'}
            </Text>
          </View>
        </View>

        {/* Course Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colIndex]}>#</Text>
            <Text style={[styles.tableHeaderText, styles.colDescription]}>Course Details</Text>
            <Text style={[styles.tableHeaderText, styles.colAmount]}>Amount</Text>
          </View>

          {/* Table Rows */}
          {courses.map((course, index) => (
            <View 
              key={course._id} 
              style={[
                styles.tableRow, 
                index % 2 === 1 ? styles.tableRowEven : null
              ]}
            >
              <Text style={[styles.colIndex, { fontSize: 10, color: '#6b7280' }]}>
                {index + 1}
              </Text>
              <View style={styles.colDescription}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseTutor}>
                  Instructor: {course.tutor?.fullName || 'Expert Instructor'}
                </Text>
                {course.category && (
                  <Text style={styles.courseTutor}>
                    Category: {course.category.name}
                  </Text>
                )}
              </View>
              <Text style={[styles.colAmount, styles.coursePrice]}>
                {formatCurrency(course.price)}
              </Text>
            </View>
          ))}
        </View>

        {/* Summary Section */}
        <View style={styles.summarySection}>
          {/* Terms and Conditions */}
          <View style={styles.termsSection}>
            <Text style={styles.termsTitle}>Terms & Conditions</Text>
            <Text style={styles.termItem}>
              • This invoice is computer generated and does not require a physical signature.
            </Text>
            <Text style={styles.termItem}>
              • All course fees are non-refundable as per our refund policy.
            </Text>
            <Text style={styles.termItem}>
              • Course access is provided for lifetime unless otherwise specified.
            </Text>
            <Text style={styles.termItem}>
              • For any queries, please contact our support team.
            </Text>
            <Text style={styles.termItem}>
              • GST is applicable as per Indian tax regulations.
            </Text>
            
            <View style={{ marginTop: 15 }}>
              <Text style={styles.termsTitle}>Support Information</Text>
              <Text style={styles.termItem}>Email: support@hokzacademy.com</Text>
              <Text style={styles.termItem}>Phone: +91 9876543210</Text>
              <Text style={styles.termItem}>Hours: Mon-Fri 9:00 AM - 6:00 PM IST</Text>
            </View>
          </View>

          {/* Totals Section */}
          <View style={styles.totalsSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>{formatCurrency(orderData.totalAmount)}</Text>
            </View>
            
            {orderData.couponDiscount > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Coupon Discount:</Text>
                <Text style={styles.discountValue}>-{formatCurrency(orderData.couponDiscount)}</Text>
              </View>
            )}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>GST (18%):</Text>
              <Text style={styles.totalValue}>{formatCurrency(orderData.taxAmount)}</Text>
            </View>

            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total Amount:</Text>
              <Text style={styles.grandTotalValue}>{formatCurrency(orderData.finalAmount)}</Text>
            </View>
          </View>
        </View>

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <Text style={styles.signatureText}>Authorized Signature</Text>
          <Image src={hokzAcademySignature} style={styles.signatureImage} />
          <Text style={styles.signatureName}>Hokz Academy</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for choosing Hokz Academy for your learning journey!
          </Text>
          <Text style={styles.footerWebsite}>www.hokzacademy.com</Text>
        </View>

      </Page>
    </Document>
  );
};

export default InvoicePDF;