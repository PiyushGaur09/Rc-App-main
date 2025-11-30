import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import { generatePDF } from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';

const Pdfpage = () => {
  const insets = useSafeAreaInsets();

  // State for all form fields
  const [formNo, setFormNo] = useState('RC001');
  const [date, setDate] = useState('18-09-2025');
  const [entryCreatedBy, setEntryCreatedBy] = useState('Umar Farooq Chesti');
  const [customerName, setCustomerName] = useState('John Doe');
  const [penetrage, setPenetrage] = useState('Abdul Rahman');
  const [address, setAddress] = useState('Avvantipora, Pulwama');
  const [mobileNo, setMobileNo] = useState('9797000000');
  const [areTractorOwner, setAreTractorOwner] = useState('Yes');
  const [tractorName, setTractorName] = useState('John Deere Tractor');
  const [model, setModel] = useState('50500 Gear Pro');
  const [chassisNo, setChassisNo] = useState('CH12345');
  const [engineNo, setEngineNo] = useState('EN88765');
  const [dateOfDelivery, setDateOfDelivery] = useState('01-09-2025');
  const [yearOfManufacture, setYearOfManufacture] = useState('2025');
  const [hypotrification, setHypotrification] = useState('John Deere Financial India Private');

  // Function to create PDF and open it
  const createAndOpenPDF = async () => {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #000;
              line-height: 1.4;
            }
            .header {
              background: linear-gradient(to right, #7E5EA9, #20AEBC);
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .company-name {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .address {
              font-size: 16px;
              margin-bottom: 5px;
            }
            .contact {
              font-size: 14px;
            }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              margin: 15px 0;
              color: #000;
              border-bottom: 2px solid #7E5EA9;
              padding-bottom: 5px;
            }
            .field-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 12px;
              padding: 0 5px;
            }
            .field-label {
              font-size: 14px;
              color: #505C68;
              font-weight: 600;
            }
            .field-value {
              font-size: 14px;
              color: #000;
              font-weight: 600;
              text-align: right;
            }
            .terms-container {
              margin-bottom: 20px;
            }
            .term-text {
              font-size: 12px;
              color: #000;
              margin-bottom: 8px;
              line-height: 16px;
            }
            .signature-section {
              margin-top: 30px;
            }
            .signature-field {
              margin-bottom: 25px;
            }
            .signature-label {
              font-size: 14px;
              color: #000;
              font-weight: 600;
            }
            .divider {
              height: 1px;
              background-color: #E0E0E0;
              margin: 20px 0;
            }
            @media print {
              body { margin: 0; }
              .header { border-radius: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">Makroo Motor Corp.</div>
            <div class="address">Avvantipora Pulwama - 192122</div>
            <div class="contact">Contact: +91-9797221258</div>
            <div class="contact">+91-7006018041</div>
          </div>

          <div class="divider"></div>

          <div class="section">
            <div class="section-title">RC and Number Plate Delivery - Sample Format :</div>
            
            <div class="field-row">
              <span class="field-label">Form No:</span>
              <span class="field-value">${formNo}</span>
            </div>

            <div class="field-row">
              <span class="field-label">Date:</span>
              <span class="field-value">${date}</span>
            </div>

            <div class="field-row">
              <span class="field-label">Entry Created By:</span>
              <span class="field-value">${entryCreatedBy}</span>
            </div>

            <div class="field-row">
              <span class="field-label">Customer Name:</span>
              <span class="field-value">${customerName}</span>
            </div>

            <div class="field-row">
              <span class="field-label">Penetrage:</span>
              <span class="field-value">${penetrage}</span>
            </div>

            <div class="field-row">
              <span class="field-label">Address:</span>
              <span class="field-value">${address}</span>
            </div>

            <div class="field-row">
              <span class="field-label">Mobile No:</span>
              <span class="field-value">${mobileNo}</span>
            </div>

            <div class="field-row">
              <span class="field-label">Are Tractor Owner?</span>
              <span class="field-value">${areTractorOwner}</span>
            </div>
          </div>

          <div class="divider"></div>

          <div class="section">
            <div class="section-title">Tractor Details:</div>
            
            <div class="field-row">
              <span class="field-label">Tractor Name:</span>
              <span class="field-value">${tractorName}</span>
            </div>

            <div class="field-row">
              <span class="field-label">Model:</span>
              <span class="field-value">${model}</span>
            </div>

            <div class="field-row">
              <span class="field-label">Chassis No:</span>
              <span class="field-value">${chassisNo}</span>
            </div>

            <div class="field-row">
              <span class="field-label">Engine No:</span>
              <span class="field-value">${engineNo}</span>
            </div>

            <div class="field-row">
              <span class="field-label">Date of Delivery:</span>
              <span class="field-value">${dateOfDelivery}</span>
            </div>

            <div class="field-row">
              <span class="field-label">Year of Manufacture:</span>
              <span class="field-value">${yearOfManufacture}</span>
            </div>

            <div class="field-row">
              <span class="field-label">Hypotrification:</span>
              <span class="field-value">${hypotrification}</span>
            </div>
          </div>

          <div class="divider"></div>

          <div class="section">
            <div class="section-title">Terms and Conditions</div>
            
            <div class="terms-container">
              <div class="term-text">
                1. RC and Number Plate issued as per information provided at booking/registration.
              </div>
              <div class="term-text">
                2. Recipient must verify correctness of RC & Number Plate upon receipt.
              </div>
              <div class="term-text">
                3. Makroo Motor Corporation is not liable for loss, theft, damage, or delay once documents are handed over.
              </div>
              <div class="term-text">
                4. Customer-provided errors may attract administrative charges.
              </div>
              <div class="term-text">
                5. Handover marks completion of dealerships obligation.
              </div>
            </div>

            <div class="signature-section">
              <div class="signature-field">
                <span class="signature-label">Customer Signature : _______________________</span>
              </div>
              <div class="signature-field">
                <span class="signature-label">Manager Signature : _______________________</span>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      // Generate PDF with base64 option
      const options = {
        html: htmlContent,
        fileName: `RC_Delivery_Form_${formNo}_${Date.now()}.pdf`,
        directory: 'Documents',
        base64: true, // This will return base64 string
      };

      const file = await generatePDF(options);
      console.log('PDF generated:', file);

      if (file.filePath) {
        // For Android, we'll open the PDF directly
        if (Platform.OS === 'android') {
          // Try to open the PDF file directly
          const pdfUrl = `file://${file.filePath}`;
          const canOpen = await Linking.canOpenURL(pdfUrl);
          
          if (canOpen) {
            await Linking.openURL(pdfUrl);
            Alert.alert(
              'Success', 
              'PDF opened successfully! You can now download or share it from the PDF viewer.',
              [{ text: 'OK' }]
            );
          } else {
            // If direct file opening doesn't work, try with content:// URI
            Alert.alert(
              'PDF Ready', 
              `PDF generated successfully at: ${file.filePath}\n\nYou can find it in your Documents folder.`,
              [{ text: 'OK' }]
            );
          }
        } else {
          // For iOS, show success message
          Alert.alert(
            'Success', 
            `PDF downloaded successfully!\nLocation: ${file.filePath}`,
            [{ text: 'OK' }]
          );
        }
      } else {
        Alert.alert('Error', 'Failed to generate PDF file path');
      }
      
    } catch (error) {
      console.error('PDF generation error:', error);
      Alert.alert(
        'Error', 
        `Failed to generate PDF. Please try again.\n\nError: ${error.message || error}`,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View
      style={[
        styles.container,
        {paddingTop: insets.top, paddingBottom: insets.bottom},
      ]}>
      <StatusBar backgroundColor="#7E5EA9" barStyle="dark-content" />

      {/* Header with Gradient */}
      <LinearGradient
        colors={['#7E5EA9', '#20AEBC']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        <View style={styles.headerSection}>
          <Text style={styles.companyName}>Makroo Motor Corp.</Text>
          <Text style={styles.address}>Avvantipora Pulwama - 192122</Text>
          <Text style={styles.contact}>Contact: +91-9797221258</Text>
          <Text style={styles.contact}>+91-7006018041</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.divider} />

        {/* RC and Number Plate Delivery Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            RC and Number Plate Delivery - {'\n'}Sample Format :
          </Text>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Form No:</Text>
            <TextInput
              style={styles.input}
              placeholder="RC001"
              placeholderTextColor={'black'}
              value={formNo}
              onChangeText={setFormNo}
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Date:</Text>
            <TextInput
              style={styles.input}
              placeholder="18-09-2025"
              placeholderTextColor={'black'}
              value={date}
              onChangeText={setDate}
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Entry Created By:</Text>
            <TextInput
              style={styles.input}
              placeholder="Umar Farooq Chesti"
              placeholderTextColor={'black'}
              value={entryCreatedBy}
              onChangeText={setEntryCreatedBy}
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Customer Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor={'black'}
              value={customerName}
              onChangeText={setCustomerName}
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Penetrage:</Text>
            <TextInput
              style={styles.input}
              placeholder="Abdul Rahman"
              placeholderTextColor={'black'}
              value={penetrage}
              onChangeText={setPenetrage}
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Address:</Text>
            <TextInput
              style={styles.input}
              placeholder="Avvantipora, Pulwama"
              placeholderTextColor={'black'}
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Mobile No:</Text>
            <TextInput
              style={styles.input}
              placeholder="9797000000"
              keyboardType="numeric"
              placeholderTextColor={'black'}
              value={mobileNo}
              onChangeText={setMobileNo}
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Are Tractor Owner?</Text>
            <TextInput
              style={styles.input}
              placeholder="Yes"
              placeholderTextColor={'black'}
              value={areTractorOwner}
              onChangeText={setAreTractorOwner}
            />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Tractor Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tractor Details:</Text>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Tractor Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="John Deere Tractor"
              placeholderTextColor={'black'}
              value={tractorName}
              onChangeText={setTractorName}
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Model:</Text>
            <TextInput
              style={styles.input}
              placeholder="50500 Gear Pro"
              placeholderTextColor={'black'}
              value={model}
              onChangeText={setModel}
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Chassis No:</Text>
            <TextInput
              style={styles.input}
              placeholder="CH12345"
              placeholderTextColor={'black'}
              value={chassisNo}
              onChangeText={setChassisNo}
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Engine No:</Text>
            <TextInput
              style={styles.input}
              placeholder="EN88765"
              placeholderTextColor={'black'}
              value={engineNo}
              onChangeText={setEngineNo}
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Date of Delivery:</Text>
            <TextInput
              style={styles.input}
              placeholder="01-09-2025"
              placeholderTextColor={'black'}
              value={dateOfDelivery}
              onChangeText={setDateOfDelivery}
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Year of Manufacture:</Text>
            <TextInput
              style={styles.input}
              placeholder="2025"
              keyboardType="numeric"
              placeholderTextColor={'black'}
              value={yearOfManufacture}
              onChangeText={setYearOfManufacture}
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Hypotrification:</Text>
            <TextInput
              style={styles.input}
              placeholder="John Deere Financial India Private"
              placeholderTextColor={'black'}
              value={hypotrification}
              onChangeText={setHypotrification}
            />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Terms and Conditions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Terms and Conditions</Text>

          <View style={styles.termsContainer}>
            <Text style={styles.termText}>
              1. RC and Number Plate issued as per information provided at
              booking/registration.
            </Text>
            <Text style={styles.termText}>
              2. Recipient must verify correctness of RC & Number Plate upon
              receipt.
            </Text>
            <Text style={styles.termText}>
              3. Makroo Motor Corporation is not liable for loss, theft, damage,
              or delay once documents are handed over.
            </Text>
            <Text style={styles.termText}>
              4. Customer-provided errors may attract administrative charges.
            </Text>
            <Text style={styles.termText}>
              5. Handover marks completion of dealerships obligation.
            </Text>
          </View>

          {/* Signature Section */}
          <View style={styles.signatureSection}>
            <View style={styles.signatureField}>
              <Text style={styles.signatureLabel}>
                Customer Signature : _______________________
              </Text>
            </View>
            <View style={styles.signatureField}>
              <Text style={styles.signatureLabel}>
                Manager Signature : _______________________
              </Text>
            </View>
          </View>
        </View>

        {/* Generate PDF Button */}
        <TouchableOpacity style={styles.downloadButton} onPress={createAndOpenPDF}>
          <Text style={styles.downloadButtonText}>Generate & Open PDF</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    width: '100%',
    paddingVertical: 12,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginVertical: 0,
  },
  companyName: {
    fontSize: 18,
    fontFamily: 'Inter_28pt-SemiBold',
    color: 'white',
    textAlign: 'center',
  },
  address: {
    fontSize: 17,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Inter_28pt-Medium',
  },
  contact: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Inter_28pt-Medium',
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17.5,
    fontFamily: 'Inter_28pt-SemiBold',
    marginVertical: 15,
    color: '#000',
  },
  fieldRow: {
    marginBottom: 12,
    paddingHorizontal: 5,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#505C68',
    fontFamily: 'Inter_28pt-Medium',
  },
  input: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Inter_28pt-Medium',
    borderBottomWidth: 1,
    borderColor: 'black',
    paddingVertical: 4,
  },
  termsContainer: {
    marginBottom: 20,
  },
  termText: {
    fontSize: 13,
    color: '#000',
    marginBottom: 8,
    lineHeight: 16,
    fontFamily: 'Inter_28pt-Medium',
  },
  signatureSection: {
    marginTop: 15,
  },
  signatureField: {
    marginBottom: 25,
  },
  signatureLabel: {
    fontSize: 15,
    color: '#000',
    fontFamily: 'Inter_28pt-Medium',
  },
  downloadButton: {
    backgroundColor: '#7E5EA9',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 10,
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter_28pt-SemiBold',
  },
});

export default Pdfpage;