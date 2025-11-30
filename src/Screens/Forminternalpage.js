

// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   StatusBar,
//   Alert,
//   Image,
//   TextInput,
//   ActivityIndicator,
//   Platform,
//   PermissionsAndroid,
//   Share,
//   Linking,
//   ActionSheetIOS,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import axios from 'axios';
// import RNFS from 'react-native-fs';
// import { Buffer } from 'buffer';
// import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

// const API_BASE_RC = 'https://argosmob.uk/makroo/public/api/v1/rc-no-plate-delivery/form';
// const API_BASE_PDI = 'https://argosmob.uk/makroo/public/api/v1/pdi-delivery/form';
// const API_BASE_DC = 'https://argosmob.uk/makroo/public/api/v1/delivery-challan/form';

// const Forminternalpage = ({ navigation, route }) => {
//   const { item = {} } = route.params || {};
//   console.log(item);
//   const insets = useSafeAreaInsets();

//   const [loading, setLoading] = useState(false);
//   const [updating, setUpdating] = useState(false);
//   const [downloadingPdf, setDownloadingPdf] = useState(false);

//   // Generic/common fields
//   const [formId, setFormId] = useState(null);
//   const [userId, setUserId] = useState(item.user_id ?? null);
//   const [formNo, setFormNo] = useState(item.form_no ?? '');
//   const [formDate, setFormDate] = useState('');
//   const [customerName, setCustomerName] = useState('');
//   const [customerPhotoUri, setCustomerPhotoUri] = useState(null);
//   const [customerSignatureUri, setCustomerSignatureUri] = useState(null);
//   const [managerSignatureUri, setManagerSignatureUri] = useState(null);
//   const [driverSignatureUri, setDriverSignatureUri] = useState(null);

//   // Status state
//   const [currentStatus, setCurrentStatus] = useState('');

//   // RC-specific fields
//   const [employeeName, setEmployeeName] = useState('');
//   const [percentage, setPercentage] = useState('');
//   const [address, setAddress] = useState('');
//   const [mobileNo, setMobileNo] = useState('');
//   const [registrationNo, setRegistrationNo] = useState('');
//   const [tractorModel, setTractorModel] = useState('');
//   const [selectDate, setSelectDate] = useState('');
//   const [hypothecation, setHypothecation] = useState('');
//   const [hypothecationOther, setHypothecationOther] = useState('');
//   const [chassisNo, setChassisNo] = useState('');
//   const [engineNo, setEngineNo] = useState('');
//   const [rcIssued, setRcIssued] = useState('');
//   const [rcIssuedAt, setRcIssuedAt] = useState('');
//   const [rcIssueNo, setRcIssueNo] = useState('');
//   const [plateIssued, setPlateIssued] = useState('');
//   const [plateIssuedAt, setPlateIssuedAt] = useState('');
//   const [plateIssueNo, setPlateIssueNo] = useState('');
//   const [tractorOwner, setTractorOwner] = useState('');
//   const [relativeName, setRelativeName] = useState('');
//   const [relativeFatherName, setRelativeFatherName] = useState('');
//   const [relativeAddress, setRelativeAddress] = useState('');
//   const [relativePhone, setRelativePhone] = useState('');
//   const [relativeRelation, setRelativeRelation] = useState('');
//   const [relationOther, setRelationOther] = useState('');
//   const [status, setStatus] = useState('');
//   const [location, setLocation] = useState('');
//   const [paymentMethod, setPaymentMethod] = useState('');

//   // PDI-specific fields
//   const [inspectorName, setInspectorName] = useState('');
//   const [tireMake, setTireMake] = useState('');
//   const [tireMakeOther, setTireMakeOther] = useState('');
//   const [frontRightSerialNo, setFrontRightSerialNo] = useState('');
//   const [frontLeftSerialNo, setFrontLeftSerialNo] = useState('');
//   const [rearRightSerialNo, setRearRightSerialNo] = useState('');
//   const [rearLeftSerialNo, setRearLeftSerialNo] = useState('');
//   const [batteryMake, setBatteryMake] = useState('');
//   const [batteryMakeOther, setBatteryMakeOther] = useState('');
//   const [batteryDate, setBatteryDate] = useState('');
//   const [batterySerialNo, setBatterySerialNo] = useState('');
//   const [tractorStarterSerialNo, setTractorStarterSerialNo] = useState('');
//   const [fipNo, setFipNo] = useState('');
//   const [tractorAlternatorNo, setTractorAlternatorNo] = useState('');
//   const [lightsOk, setLightsOk] = useState('');
//   const [nutsOk, setNutsOk] = useState('');
//   const [hydraulicOil, setHydraulicOil] = useState('');
//   const [lightsNo, setLightsNo] = useState('');
//   const [nutsNo, setNutsNo] = useState('');
//   const [hydraulicOilHalf, setHydraulicOilHalf] = useState('');
//   const [allNutsSealed, setAllNutsSealed] = useState('');
//   const [allNutsSealedNo, setAllNutsSealedNo] = useState('');
//   const [tractorDelivered, setTractorDelivered] = useState('');
//   const [deliveryDate, setDeliveryDate] = useState('');
//   const [dealerName, setDealerName] = useState('');
//   const [customerFatherName, setCustomerFatherName] = useState('');
//   const [customerAddress, setCustomerAddress] = useState('');
//   const [customerContact, setCustomerContact] = useState('');
//   const [hypothecationPDI, setHypothecationPDI] = useState('');
//   const [hypothecationOtherPDI, setHypothecationOtherPDI] = useState('');
//   const [engineOilLevel, setEngineOilLevel] = useState('');
//   const [coolantLevel, setCoolantLevel] = useState('');
//   const [brakeFluidLevel, setBrakeFluidLevel] = useState('');
//   const [greasingDone, setGreasingDone] = useState('');
//   const [paintScratches, setPaintScratches] = useState('');
//   const [toolkitAvailable, setToolkitAvailable] = useState('');
//   const [ownerManualGiven, setOwnerManualGiven] = useState('');
//   const [reflectorStickerApplied, setReflectorStickerApplied] = useState('');
//   const [numberPlateFixed, setNumberPlateFixed] = useState('');
//   const [pdiDoneBy, setPdiDoneBy] = useState('');
//   const [remarks, setRemarks] = useState('');
//   const [statusPDI, setStatusPDI] = useState('');
//   const [locationPDI, setLocationPDI] = useState('');
//   const [paymentMethodPDI, setPaymentMethodPDI] = useState('');

//   // DC-specific fields
//   const [selectDateDC, setSelectDateDC] = useState('');
//   const [deliveryMode, setDeliveryMode] = useState('');
//   const [branchName, setBranchName] = useState('');
//   const [branchPersonName, setBranchPersonName] = useState('');
//   const [branchAddress, setBranchAddress] = useState('');
//   const [branchPhone, setBranchPhone] = useState('');
//   const [challanCreatedBy, setChallanCreatedBy] = useState('');
//   const [parentage, setParentage] = useState('');
//   const [isCustomer, setIsCustomer] = useState(false);
//   const [relativeNameDC, setRelativeNameDC] = useState('');
//   const [relativeFatherNameDC, setRelativeFatherNameDC] = useState('');
//   const [relativeAddressDC, setRelativeAddressDC] = useState('');
//   const [relativePhoneDC, setRelativePhoneDC] = useState('');
//   const [relativeRelationDC, setRelativeRelationDC] = useState('');
//   const [relationOtherDC, setRelationOtherDC] = useState('');
//   const [tractorName, setTractorName] = useState('');
//   const [yearOfManufacture, setYearOfManufacture] = useState('');
//   const [fipMake, setFipMake] = useState('');
//   const [fipMakeOther, setFipMakeOther] = useState('');
//   const [batteryMakeDC, setBatteryMakeDC] = useState('');
//   const [batteryMakeOtherDC, setBatteryMakeOtherDC] = useState('');
//   const [tireMakeOtherDC, setTireMakeOtherDC] = useState('');
//   const [dealPrice, setDealPrice] = useState('');
//   const [amountPaid, setAmountPaid] = useState('');
//   const [totalPaid, setTotalPaid] = useState('');
//   const [balanceAmount, setBalanceAmount] = useState('');
//   const [paymentStatus, setPaymentStatus] = useState('');
//   const [financierName, setFinancierName] = useState('');
//   const [accessoriesJson, setAccessoriesJson] = useState('');
//   const [termsAccepted, setTermsAccepted] = useState(false);
//   const [financeAmountPaid, setFinanceAmountPaid] = useState('');
//   const [statusDC, setStatusDC] = useState('');
//   const [locationDC, setLocationDC] = useState('');
//   const [paymentMethodDC, setPaymentMethodDC] = useState('');

//   // determine prefix helper
//   const prefixOf = (s) => (s ? String(s).trim().toUpperCase().slice(0, 3) : '');

//   const pickBaseByFormNo = (fno) => {
//     const p = prefixOf(fno);
//     if (p.startsWith('RC')) return API_BASE_RC;
//     if (p.startsWith('PDI')) return API_BASE_PDI;
//     if (p.startsWith('DC')) return API_BASE_DC;
//     if (item.form_no) {
//       const ip = prefixOf(item.form_no);
//       if (ip.startsWith('RC')) return API_BASE_RC;
//       if (ip.startsWith('PDI')) return API_BASE_PDI;
//       if (ip.startsWith('DC')) return API_BASE_DC;
//     }
//     return API_BASE_RC;
//   };

//   useEffect(() => {
//     if (!item || !item.id) {
//       Alert.alert('No ID', 'item.id is required to fetch form.');
//       return;
//     }
//     const initialFormNo = item.form_no ?? formNo;
//     fetchForm(item.id, initialFormNo);
//   }, [item]);

//   const makeAbsoluteUrl = (relativePath) => {
//     if (!relativePath) return null;
//     if (relativePath.startsWith('http')) return relativePath;
//     return `https://argosmob.uk/makroo/public/${relativePath.replace(/^\/+/, '')}`;
//   };

//   const boolToYesNo = (val) => {
//     if (val === null || val === undefined || val === '') return '';
//     if (typeof val === 'number') return val === 1 ? 'Yes' : 'No';
//     const s = String(val).trim().toLowerCase();
//     if (s === '1' || s === 'true' || s === 'yes' || s === 'y') return 'Yes';
//     if (s === '0' || s === 'false' || s === 'no' || s === 'n') return 'No';
//     return s.charAt(0).toUpperCase() + s.slice(1);
//   };

//   const yesNoToServer = (val) => {
//     if (!val && val !== '') return '0';
//     const s = String(val).trim().toLowerCase();
//     return s === 'yes' || s === 'y' ? '1' : '0';
//   };

//   const fetchForm = async (id, sampleFormNo = '') => {
//     setLoading(true);
//     try {
//       const base = pickBaseByFormNo(sampleFormNo);
//       const url = `${base}/get`;

//       const data = new FormData();
//       data.append('id', String(id));

//       const resp = await axios.post(url, data, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//         maxContentLength: Infinity,
//         maxBodyLength: Infinity,
//       });

//       if (resp?.data?.status && resp.data.data) {
//         const d = resp.data.data;

//         // common
//         setFormId(d.id ?? id);
//         setUserId(d.user_id ?? userId);
//         setFormNo(d.form_no ?? formNo);
//         setFormDate(d.form_date ?? '');
//         setCustomerName(d.customer_name ?? '');

//         setCustomerPhotoUri(d.customer_photo ? makeAbsoluteUrl(d.customer_photo) : null);
//         setCustomerSignatureUri(d.customer_signature ? makeAbsoluteUrl(d.customer_signature) : null);
//         setManagerSignatureUri(d.manager_signature ? makeAbsoluteUrl(d.manager_signature) : null);
//         setDriverSignatureUri(d.driver_signature ? makeAbsoluteUrl(d.driver_signature) : null);

//         // RC mapping
//         if (base === API_BASE_RC) {
//           setEmployeeName(d.employee_name ?? '');
//           setPercentage(String(d.percentage ?? ''));
//           setAddress(d.address ?? '');
//           setMobileNo(d.mobile_no ?? '');
//           setRegistrationNo(d.registration_no ?? '');
//           setTractorModel(d.tractor_model ?? '');
//           setSelectDate(d.select_date ?? '');
//           setHypothecation(d.hypothecation ?? '');
//           setHypothecationOther(d.hypothecation_other ?? '');
//           setChassisNo(d.chassis_no ?? '');
//           setEngineNo(d.engine_no ?? '');
//           setRcIssued(boolToYesNo(d.rc_issued ?? ''));
//           setRcIssuedAt(d.rc_issued_at ?? '');
//           setRcIssueNo(d.rc_issue_no ?? '');
//           setPlateIssued(boolToYesNo(d.plate_issued ?? ''));
//           setPlateIssuedAt(d.plate_issued_at ?? '');
//           setPlateIssueNo(d.plate_issue_no ?? '');
//           setTractorOwner(boolToYesNo(d.tractor_owner ?? ''));
//           setRelativeName(d.relative_name ?? '');
//           setRelativeFatherName(d.relative_father_name ?? '');
//           setRelativeAddress(d.relative_address ?? '');
//           setRelativePhone(d.relative_phone ?? '');
//           setRelativeRelation(d.relative_relation ?? '');
//           setRelationOther(d.relation_other ?? '');
//           setStatus(d.status ?? '');
//           setLocation(d.location ?? '');
//           setPaymentMethod(d.payment_method ?? '');
//           setCurrentStatus(d.status ?? '');
//         }

//         // PDI mapping
//         if (base === API_BASE_PDI) {
//           setInspectorName(d.inspector_name ?? '');
//           setSelectDate(d.select_date ?? '');
//           setTractorModel(d.tractor_model ?? '');
//           setChassisNo(d.chassis_no ?? '');
//           setEngineNo(d.engine_no ?? '');
//           setTireMake(d.tire_make ?? '');
//           setTireMakeOther(d.tire_make_other ?? '');
//           setFrontRightSerialNo(d.front_right_serial_no ?? '');
//           setFrontLeftSerialNo(d.front_left_serial_no ?? '');
//           setRearRightSerialNo(d.rear_right_serial_no ?? '');
//           setRearLeftSerialNo(d.rear_left_serial_no ?? '');
//           setBatteryMake(d.battery_make ?? '');
//           setBatteryMakeOther(d.battery_make_other ?? '');
//           setBatteryDate(d.battery_date ?? '');
//           setBatterySerialNo(d.battery_serial_no ?? '');
//           setTractorStarterSerialNo(d.tractor_starter_serial_no ?? '');
//           setFipNo(d.fip_no ?? '');
//           setTractorAlternatorNo(d.tractor_alternator_no ?? '');
//           setLightsOk(boolToYesNo(d.lights_ok ?? ''));
//           setNutsOk(boolToYesNo(d.nuts_ok ?? ''));
//           setHydraulicOil(boolToYesNo(d.hydraulic_oil ?? ''));
//           setLightsNo(d.lights_no ?? '');
//           setNutsNo(d.nuts_no ?? '');
//           setHydraulicOilHalf(d.hydraulic_oil_half ?? '');
//           setAllNutsSealed(boolToYesNo(d.all_nuts_sealed ?? ''));
//           setAllNutsSealedNo(d.all_nuts_sealed_no ?? '');
//           setTractorDelivered(boolToYesNo(d.tractor_delivered ?? ''));
//           setDeliveryDate(d.delivery_date ?? '');
//           setDealerName(d.dealer_name ?? '');
//           setCustomerName(d.customer_name ?? '');
//           setCustomerFatherName(d.customer_father_name ?? '');
//           setCustomerAddress(d.customer_address ?? '');
//           setCustomerContact(d.customer_contact ?? '');
//           setHypothecationPDI(d.hypothecation ?? '');
//           setHypothecationOtherPDI(d.hypothecation_other ?? '');
//           setEngineOilLevel(boolToYesNo(d.engine_oil_level ?? ''));
//           setCoolantLevel(boolToYesNo(d.coolant_level ?? ''));
//           setBrakeFluidLevel(boolToYesNo(d.brake_fluid_level ?? ''));
//           setGreasingDone(boolToYesNo(d.greasing_done ?? ''));
//           setPaintScratches(boolToYesNo(d.paint_scratches ?? ''));
//           setToolkitAvailable(boolToYesNo(d.toolkit_available ?? ''));
//           setOwnerManualGiven(boolToYesNo(d.owner_manual_given ?? ''));
//           setReflectorStickerApplied(boolToYesNo(d.reflector_sticker_applied ?? ''));
//           setNumberPlateFixed(boolToYesNo(d.number_plate_fixed ?? ''));
//           setPdiDoneBy(d.pdi_done_by ?? '');
//           setRemarks(d.remarks ?? '');
//           setStatusPDI(d.status ?? '');
//           setLocationPDI(d.location ?? '');
//           setPaymentMethodPDI(d.payment_method ?? '');
//           setCurrentStatus(d.status ?? '');
//         }

//         // DC mapping
//         if (base === API_BASE_DC) {
//           setSelectDateDC(d.select_date ?? '');
//           setDeliveryMode(d.delivery_mode ?? '');
//           setBranchName(d.branch_name ?? '');
//           setBranchPersonName(d.branch_person_name ?? '');
//           setBranchAddress(d.branch_address ?? '');
//           setBranchPhone(d.branch_phone ?? '');
//           setChallanCreatedBy(d.challan_created_by ?? '');
//           setCustomerName(d.customer_name ?? '');
//           setParentage(d.parentage ?? '');
//           setAddress(d.address ?? '');
//           setHypothecation(d.hypothecation ?? '');
//           setHypothecationOther(d.hypothecation_other ?? '');
//           setMobileNo(d.mobile_no ?? '');
//           setIsCustomer(Boolean(d.is_customer));
//           setRelativeNameDC(d.relative_name ?? '');
//           setRelativeFatherNameDC(d.relative_father_name ?? '');
//           setRelativeAddressDC(d.relative_address ?? '');
//           setRelativePhoneDC(d.relative_phone ?? '');
//           setRelativeRelationDC(d.relative_relation ?? '');
//           setRelationOtherDC(d.relation_other ?? '');
//           setTractorName(d.tractor_name ?? '');
//           setTractorModel(d.tractor_model ?? '');
//           setChassisNo(d.chassis_no ?? '');
//           setEngineNo(d.engine_no ?? '');
//           setYearOfManufacture(d.year_of_manufacture ?? '');
//           setTireMake(d.tire_make ?? '');
//           setTireMakeOtherDC(d.tire_make_other ?? '');
//           setFipMake(d.fip_make ?? '');
//           setFipMakeOther(d.fip_make_other ?? '');
//           setBatteryMakeDC(d.battery_make ?? '');
//           setBatteryMakeOtherDC(d.battery_make_other ?? '');
//           setDealPrice(String(d.deal_price ?? ''));
//           setAmountPaid(String(d.amount_paid ?? ''));
//           setTotalPaid(String(d.total_paid ?? ''));
//           setBalanceAmount(String(d.balance_amount ?? ''));
//           setPaymentStatus(d.payment_status ?? '');
//           setFinancierName(d.financier_name ?? '');
//           setAccessoriesJson(d.accessories ?? '');
//           setTermsAccepted(Boolean(d.terms_accepted));
//           setRemarks(d.remarks ?? '');
//           setFinanceAmountPaid(String(d.finance_amount_paid ?? ''));
//           setStatusDC(d.status ?? '');
//           setLocationDC(d.location ?? '');
//           setPaymentMethodDC(d.payment_method ?? '');
//           setCurrentStatus(d.status ?? '');
//         }
//       } else {
//         Alert.alert('Fetch failed', resp?.data?.message ?? 'Failed to fetch record');
//       }
//     } catch (err) {
//       console.warn('fetchForm error', err);
//       Alert.alert('Error', 'Network/server error while fetching form.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isFormEditable = () => {
//     return currentStatus === 'edited';
//   };

//   const handleUpdate = async () => {
//     if (!isFormEditable()) {
//       Alert.alert('Cannot Edit', 'This form cannot be edited in its current status.');
//       return;
//     }

//     const base = pickBaseByFormNo(formNo ?? item.form_no ?? '');
//     const url = `${base}/update`;

//     setUpdating(true);
//     try {
//       const data = new FormData();
//       data.append('id', String(formId ?? item.id ?? ''));
//       data.append('form_no', formNo ?? '');
//       if (userId) data.append('user_id', String(userId));

//       // Common fields
//       if (formDate) data.append('form_date', formDate);

//       // Append signature images if they are local URIs (newly selected)
//       if (customerSignatureUri && customerSignatureUri.startsWith('file://')) {
//         data.append('customer_signature', {
//           uri: customerSignatureUri,
//           type: 'image/jpeg',
//           name: 'customer_signature.jpg',
//         });
//       }

//       if (managerSignatureUri && managerSignatureUri.startsWith('file://')) {
//         data.append('manager_signature', {
//           uri: managerSignatureUri,
//           type: 'image/jpeg',
//           name: 'manager_signature.jpg',
//         });
//       }

//       if (driverSignatureUri && driverSignatureUri.startsWith('file://') && base === API_BASE_DC) {
//         data.append('driver_signature', {
//           uri: driverSignatureUri,
//           type: 'image/jpeg',
//           name: 'driver_signature.jpg',
//         });
//       }

//       if (base === API_BASE_RC) {
//         // RC update payload
//         if (employeeName) data.append('employee_name', employeeName);
//         if (customerName) data.append('customer_name', customerName);
//         if (percentage) data.append('percentage', String(percentage));
//         if (address) data.append('address', address);
//         if (mobileNo) data.append('mobile_no', mobileNo);
//         if (registrationNo) data.append('registration_no', registrationNo);
//         if (tractorModel) data.append('tractor_model', tractorModel);
//         if (selectDate) data.append('select_date', selectDate);
//         if (hypothecation) data.append('hypothecation', hypothecation);
//         if (hypothecationOther) data.append('hypothecation_other', hypothecationOther);
//         if (chassisNo) data.append('chassis_no', chassisNo);
//         if (engineNo) data.append('engine_no', engineNo);
//         if (rcIssued) data.append('rc_issued', yesNoToServer(rcIssued));
//         if (rcIssuedAt) data.append('rc_issued_at', rcIssuedAt);
//         if (rcIssueNo) data.append('rc_issue_no', rcIssueNo);
//         if (plateIssued) data.append('plate_issued', yesNoToServer(plateIssued));
//         if (plateIssuedAt) data.append('plate_issued_at', plateIssuedAt);
//         if (plateIssueNo) data.append('plate_issue_no', plateIssueNo);
//         if (tractorOwner) data.append('tractor_owner', yesNoToServer(tractorOwner));
//         if (relativeName) data.append('relative_name', relativeName);
//         if (relativeFatherName) data.append('relative_father_name', relativeFatherName);
//         if (relativeAddress) data.append('relative_address', relativeAddress);
//         if (relativePhone) data.append('relative_phone', relativePhone);
//         if (relativeRelation) data.append('relative_relation', relativeRelation);
//         if (relationOther) data.append('relation_other', relationOther);
//         if (status) data.append('status', status);
//         if (location) data.append('location', location);
//         if (paymentMethod) data.append('payment_method', paymentMethod);
//       } else if (base === API_BASE_PDI) {
//         // PDI update payload
//         if (inspectorName) data.append('inspector_name', inspectorName);
//         if (selectDate) data.append('select_date', selectDate);
//         if (tractorModel) data.append('tractor_model', tractorModel);
//         if (chassisNo) data.append('chassis_no', chassisNo);
//         if (engineNo) data.append('engine_no', engineNo);
//         if (tireMake) data.append('tire_make', tireMake);
//         if (tireMakeOther) data.append('tire_make_other', tireMakeOther);
//         if (frontRightSerialNo) data.append('front_right_serial_no', frontRightSerialNo);
//         if (frontLeftSerialNo) data.append('front_left_serial_no', frontLeftSerialNo);
//         if (rearRightSerialNo) data.append('rear_right_serial_no', rearRightSerialNo);
//         if (rearLeftSerialNo) data.append('rear_left_serial_no', rearLeftSerialNo);
//         if (batteryMake) data.append('battery_make', batteryMake);
//         if (batteryMakeOther) data.append('battery_make_other', batteryMakeOther);
//         if (batteryDate) data.append('battery_date', batteryDate);
//         if (batterySerialNo) data.append('battery_serial_no', batterySerialNo);
//         if (tractorStarterSerialNo) data.append('tractor_starter_serial_no', tractorStarterSerialNo);
//         if (fipNo) data.append('fip_no', fipNo);
//         if (tractorAlternatorNo) data.append('tractor_alternator_no', tractorAlternatorNo);
//         if (lightsOk) data.append('lights_ok', yesNoToServer(lightsOk));
//         if (nutsOk) data.append('nuts_ok', yesNoToServer(nutsOk));
//         if (hydraulicOil) data.append('hydraulic_oil', yesNoToServer(hydraulicOil));
//         if (lightsNo) data.append('lights_no', lightsNo);
//         if (nutsNo) data.append('nuts_no', nutsNo);
//         if (hydraulicOilHalf) data.append('hydraulic_oil_half', hydraulicOilHalf);
//         if (allNutsSealed) data.append('all_nuts_sealed', yesNoToServer(allNutsSealed));
//         if (allNutsSealedNo) data.append('all_nuts_sealed_no', allNutsSealedNo);
//         if (tractorDelivered) data.append('tractor_delivered', yesNoToServer(tractorDelivered));
//         if (deliveryDate) data.append('delivery_date', deliveryDate);
//         if (dealerName) data.append('dealer_name', dealerName);
//         if (customerName) data.append('customer_name', customerName);
//         if (customerFatherName) data.append('customer_father_name', customerFatherName);
//         if (customerAddress) data.append('customer_address', customerAddress);
//         if (customerContact) data.append('customer_contact', customerContact);
//         if (hypothecationPDI) data.append('hypothecation', hypothecationPDI);
//         if (hypothecationOtherPDI) data.append('hypothecation_other', hypothecationOtherPDI);
//         if (engineOilLevel) data.append('engine_oil_level', yesNoToServer(engineOilLevel));
//         if (coolantLevel) data.append('coolant_level', yesNoToServer(coolantLevel));
//         if (brakeFluidLevel) data.append('brake_fluid_level', yesNoToServer(brakeFluidLevel));
//         if (greasingDone) data.append('greasing_done', yesNoToServer(greasingDone));
//         if (paintScratches) data.append('paint_scratches', yesNoToServer(paintScratches));
//         if (toolkitAvailable) data.append('toolkit_available', yesNoToServer(toolkitAvailable));
//         if (ownerManualGiven) data.append('owner_manual_given', yesNoToServer(ownerManualGiven));
//         if (reflectorStickerApplied) data.append('reflector_sticker_applied', yesNoToServer(reflectorStickerApplied));
//         if (numberPlateFixed) data.append('number_plate_fixed', yesNoToServer(numberPlateFixed));
//         if (pdiDoneBy) data.append('pdi_done_by', pdiDoneBy);
//         if (remarks) data.append('remarks', remarks);
//         if (statusPDI) data.append('status', statusPDI);
//         if (locationPDI) data.append('location', locationPDI);
//         if (paymentMethodPDI) data.append('payment_method', paymentMethodPDI);
//       } else if (base === API_BASE_DC) {
//         // DC update payload
//         if (selectDateDC) data.append('select_date', selectDateDC);
//         if (deliveryMode) data.append('delivery_mode', deliveryMode);
//         if (branchName) data.append('branch_name', branchName);
//         if (branchPersonName) data.append('branch_person_name', branchPersonName);
//         if (branchAddress) data.append('branch_address', branchAddress);
//         if (branchPhone) data.append('branch_phone', branchPhone);
//         if (challanCreatedBy) data.append('challan_created_by', challanCreatedBy);
//         if (customerName) data.append('customer_name', customerName);
//         if (parentage) data.append('parentage', parentage);
//         if (address) data.append('address', address);
//         if (hypothecation) data.append('hypothecation', hypothecation);
//         if (hypothecationOther) data.append('hypothecation_other', hypothecationOther);
//         if (mobileNo) data.append('mobile_no', mobileNo);
//         data.append('is_customer', isCustomer ? '1' : '0');
//         if (relativeNameDC) data.append('relative_name', relativeNameDC);
//         if (relativeFatherNameDC) data.append('relative_father_name', relativeFatherNameDC);
//         if (relativeAddressDC) data.append('relative_address', relativeAddressDC);
//         if (relativePhoneDC) data.append('relative_phone', relativePhoneDC);
//         if (relativeRelationDC) data.append('relative_relation', relativeRelationDC);
//         if (relationOtherDC) data.append('relation_other', relationOtherDC);
//         if (tractorName) data.append('tractor_name', tractorName);
//         if (tractorModel) data.append('tractor_model', tractorModel);
//         if (chassisNo) data.append('chassis_no', chassisNo);
//         if (engineNo) data.append('engine_no', engineNo);
//         if (yearOfManufacture) data.append('year_of_manufacture', yearOfManufacture);
//         if (tireMake) data.append('tyres_make', tireMake);
//         if (tireMakeOtherDC) data.append('tire_make_other', tireMakeOtherDC);
//         if (fipMake) data.append('fip_make', fipMake);
//         if (fipMakeOther) data.append('fip_make_other', fipMakeOther);
//         if (batteryMakeDC) data.append('battery_make', batteryMakeDC);
//         if (batteryMakeOtherDC) data.append('battery_make_other', batteryMakeOtherDC);
//         if (dealPrice) data.append('deal_price', dealPrice);
//         if (amountPaid) data.append('amount_paid', amountPaid);
//         if (totalPaid) data.append('total_paid', totalPaid);
//         if (balanceAmount) data.append('balance_amount', balanceAmount);
//         if (paymentStatus) data.append('payment_status', paymentStatus);
//         if (financierName) data.append('financier_name', financierName);
//         if (accessoriesJson) data.append('accessories', accessoriesJson);
//         data.append('terms_accepted', termsAccepted ? '1' : '0');
//         if (remarks) data.append('remarks', remarks);
//         if (financeAmountPaid) data.append('finance_amount_paid', financeAmountPaid);
//         if (statusDC) data.append('status', statusDC);
//         if (locationDC) data.append('location', locationDC);
//         if (paymentMethodDC) data.append('payment_method', paymentMethodDC);
//       }

//       const resp = await axios.post(url, data, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//         maxContentLength: Infinity,
//         maxBodyLength: Infinity,
//       });

//       if (resp?.data?.status) {
//         Alert.alert('Success', resp.data.message ?? 'Updated successfully');
//         if (resp.data.data) {
//           const d = resp.data.data;
//           fetchForm(d.id ?? formId ?? item.id, d.form_no ?? formNo);
//         }
//       } else {
//         Alert.alert('Update failed', resp?.data?.message ?? 'Unknown error during update.');
//       }
//     } catch (err) {
//       console.warn('update error', err);
//       Alert.alert('Error', 'Network/server error while updating.');
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleHome = () => {
//     navigation.goBack();
//   };

//   const requestWritePermission = async () => {
//     if (Platform.OS !== 'android') return true;

//     const androidApiLevel = Platform.Version;
//     if (typeof androidApiLevel === 'number' && androidApiLevel >= 30) {
//       return true;
//     }

//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         {
//           title: 'Storage Permission',
//           message: 'App needs access to storage to download the PDF',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         }
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     } catch (err) {
//       console.warn('permission error', err);
//       return false;
//     }
//   };

//   const handleDownloadPdf = async () => {
//     if (currentStatus !== 'approved') {
//       Alert.alert('Download Not Available', 'PDF download is only available for approved forms.');
//       return;
//     }

//     const base = pickBaseByFormNo(formNo ?? item.form_no ?? '');
//     const idToUse = formId ?? item.id;
//     if (!idToUse) {
//       Alert.alert('Missing ID', 'Cannot download PDF: missing form id.');
//       return;
//     }

//     const generateUrl = `${base}/generate-pdf/${encodeURIComponent(String(idToUse))}`;

//     setDownloadingPdf(true);

//     const hasPerm = await requestWritePermission();
//     if (!hasPerm) {
//       setDownloadingPdf(false);
//       Alert.alert('Permission denied', 'Storage permission is required to save the PDF.');
//       return;
//     }

//     try {
//       const resp = await axios.get(generateUrl, {
//         responseType: 'arraybuffer',
//         maxContentLength: Infinity,
//         maxBodyLength: Infinity,
//         validateStatus: (status) => status >= 200 && status < 400,
//       });

//       let maybeJson = null;
//       try {
//         const text = Buffer.from(resp.data).toString('utf8');
//         maybeJson = JSON.parse(text);
//       } catch (e) {
//         maybeJson = null;
//       }

//       if (maybeJson && (maybeJson.pdf_link || maybeJson.download_url)) {
//         const remoteUrl = String(maybeJson.pdf_link ?? maybeJson.download_url).trim();
//         const safeRemoteUrl = encodeURI(remoteUrl);

//         try {
//           await Linking.openURL(safeRemoteUrl);
//           setDownloadingPdf(false);
//           return;
//         } catch (linkErr) {
//           console.warn('Linking.openURL failed - falling back to download', linkErr);
//         }

//         const fallbackFileName = `form_${formNo || idToUse || Date.now()}.pdf`;
//         const docPath = `${RNFS.DocumentDirectoryPath}/${fallbackFileName}`;
//         const androidDownloadsPath = RNFS.DownloadDirectoryPath ? `${RNFS.DownloadDirectoryPath}/${fallbackFileName}` : null;
//         let destPath = docPath;
//         if (Platform.OS === 'android' && androidDownloadsPath) {
//           destPath = androidDownloadsPath;
//         }

//         const dl = RNFS.downloadFile({ fromUrl: safeRemoteUrl, toFile: destPath });
//         const result = await dl.promise;
//         if (result && (result.statusCode === 200 || result.statusCode === 201)) {
//           const shareUrl = Platform.OS === 'android' ? 'file://' + destPath : destPath;
//           await Share.share({ url: shareUrl, title: 'Form PDF' });
//           setDownloadingPdf(false);
//           return;
//         } else {
//           const dl2 = RNFS.downloadFile({ fromUrl: safeRemoteUrl, toFile: docPath });
//           const r2 = await dl2.promise;
//           if (r2 && (r2.statusCode === 200 || r2.statusCode === 201)) {
//             const shareUrl = Platform.OS === 'android' ? 'file://' + docPath : docPath;
//             await Share.share({ url: shareUrl, title: 'Form PDF' });
//             setDownloadingPdf(false);
//             return;
//           }
//           throw new Error('Failed to download file from remote URL');
//         }
//       }

//       const fallbackFileName = `form_${formNo || idToUse || Date.now()}.pdf`;
//       const docPath = `${RNFS.DocumentDirectoryPath}/${fallbackFileName}`;
//       const androidDownloadsPath = RNFS.DownloadDirectoryPath ? `${RNFS.DownloadDirectoryPath}/${fallbackFileName}` : null;

//       let writePath = docPath;
//       if (Platform.OS === 'android' && androidDownloadsPath) {
//         writePath = androidDownloadsPath;
//       }

//       const base64 = Buffer.from(resp.data, 'binary').toString('base64');
//       await RNFS.writeFile(writePath, base64, 'base64');

//       const fileUrl = Platform.OS === 'android' ? 'file://' + writePath : writePath;
//       try {
//         await Linking.openURL(fileUrl);
//         setDownloadingPdf(false);
//         return;
//       } catch (openErr) {
//         console.warn('Opening saved file directly failed, falling back to Share', openErr);
//       }

//       await Share.share({ url: 'file://' + writePath, title: 'Form PDF' });
//     } catch (err) {
//       console.warn('download pdf error', err);
//       Alert.alert('Download failed', `Unable to download or open PDF. Check endpoint or network.\n\nURL: ${generateUrl}`);
//     } finally {
//       setDownloadingPdf(false);
//     }
//   };

//   // Request camera permission for Android
//   const requestCameraPermission = async () => {
//     if (Platform.OS !== 'android') return true;
    
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.CAMERA,
//         {
//           title: 'Camera Permission',
//           message: 'App needs access to your camera to take signature photos',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         }
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     } catch (err) {
//       console.warn('camera permission error', err);
//       return false;
//     }
//   };

//   // Show image source options (camera or gallery)
//   const showImageSourceOptions = (setSignatureUri) => {
//     if (!isFormEditable()) {
//       Alert.alert('Cannot Edit', 'This form cannot be edited in its current status.');
//       return;
//     }

//     if (Platform.OS === 'ios') {
//       ActionSheetIOS.showActionSheetWithOptions(
//         {
//           options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
//           cancelButtonIndex: 0,
//         },
//         async (buttonIndex) => {
//           if (buttonIndex === 1) {
//             // Take Photo
//             const hasPermission = await requestCameraPermission();
//             if (!hasPermission) {
//               Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
//               return;
//             }
//             openCamera(setSignatureUri);
//           } else if (buttonIndex === 2) {
//             // Choose from Gallery
//             openGallery(setSignatureUri);
//           }
//         }
//       );
//     } else {
//       // Android
//       Alert.alert(
//         'Select Signature Source',
//         'Choose how you want to capture the signature',
//         [
//           { text: 'Cancel', style: 'cancel' },
//           { 
//             text: 'Take Photo', 
//             onPress: async () => {
//               const hasPermission = await requestCameraPermission();
//               if (!hasPermission) {
//                 Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
//                 return;
//               }
//               openCamera(setSignatureUri);
//             } 
//           },
//           { 
//             text: 'Choose from Gallery', 
//             onPress: () => openGallery(setSignatureUri) 
//           },
//         ]
//       );
//     }
//   };

//   // Open camera to capture signature
//   const openCamera = (setSignatureUri) => {
//     const options = {
//       mediaType: 'photo',
//       quality: 0.8,
//       maxWidth: 800,
//       maxHeight: 800,
//       cameraType: 'back',
//       saveToPhotos: false,
//     };

//     launchCamera(options, (response) => {
//       if (response.didCancel) {
//         console.log('User cancelled camera');
//       } else if (response.error) {
//         console.log('Camera Error: ', response.error);
//         Alert.alert('Error', 'Failed to capture image');
//       } else if (response.assets && response.assets.length > 0) {
//         const uri = response.assets[0].uri;
//         setSignatureUri(uri);
//       }
//     });
//   };

//   // Open gallery to choose signature
//   const openGallery = (setSignatureUri) => {
//     const options = {
//       mediaType: 'photo',
//       quality: 0.8,
//       maxWidth: 800,
//       maxHeight: 800,
//     };

//     launchImageLibrary(options, (response) => {
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.error) {
//         console.log('ImagePicker Error: ', response.error);
//         Alert.alert('Error', 'Failed to pick image');
//       } else if (response.assets && response.assets.length > 0) {
//         const uri = response.assets[0].uri;
//         setSignatureUri(uri);
//       }
//     });
//   };

//   if (loading) {
//     return (
//       <View style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   const currentBase = pickBaseByFormNo(formNo ?? item.form_no ?? '');
//   const isRC = currentBase === API_BASE_RC;
//   const isPDI = currentBase === API_BASE_PDI;
//   const isDC = currentBase === API_BASE_DC;
//   const editable = isFormEditable();

//   return (
//     <View style={[styles.container, { paddingTop: insets.top }]}>
//       <StatusBar backgroundColor="#7E5EA9" barStyle="dark-content" />
//       <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
//         <View style={styles.headerContent}>
//           <Text style={styles.headerTitle}>Customer Profile</Text>
//         </View>
//       </LinearGradient>

//       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
//         {customerPhotoUri ? (
//           <Image source={{ uri: customerPhotoUri }} style={styles.avatar} />
//         ) : (
//           <Image source={require('../Asset/Images/c10.png')} style={styles.avatar} />
//         )}

//         <View style={styles.customerHeader}>
//           <Text style={styles.customerName}>{customerName || '—'}</Text>
//           <Text style={styles.customerId}>Form: {formNo || '—'}</Text>
//           <Text style={[styles.statusText, 
//             currentStatus === 'approved' ? styles.statusApproved :
//             currentStatus === 'pending' ? styles.statusPending :
//             currentStatus === 'rejected' ? styles.statusRejected :
//             currentStatus === 'edited' ? styles.statusEdited :
//             styles.statusDefault
//           ]}>
//             Status: {currentStatus || '—'}
//           </Text>
//         </View>

//         <View style={styles.formSection}>
//           {/* RC specific */}
//           {isRC && (
//             <>
//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Form Date</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={formDate} 
//                     onChangeText={setFormDate} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Employee Name</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={employeeName} 
//                     onChangeText={setEmployeeName} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Customer Name</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={customerName} 
//                     onChangeText={setCustomerName} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Percentage</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={percentage} 
//                     onChangeText={setPercentage} 
//                     keyboardType="numeric" 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Address</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={address} 
//                     onChangeText={setAddress} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Mobile No</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={mobileNo} 
//                     onChangeText={setMobileNo} 
//                     keyboardType="phone-pad" 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Registration No</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={registrationNo} 
//                     onChangeText={setRegistrationNo} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Tractor Model</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={tractorModel} 
//                     onChangeText={setTractorModel} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Select Date</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={selectDate} 
//                     onChangeText={setSelectDate} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Hypothecation</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={hypothecation} 
//                     onChangeText={setHypothecation} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Hypothecation Other</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={hypothecationOther} 
//                     onChangeText={setHypothecationOther} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Chassis No</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={chassisNo} 
//                     onChangeText={setChassisNo} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Engine No</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={engineNo} 
//                     onChangeText={setEngineNo} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>RC Issued (Yes/No)</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={rcIssued} 
//                     onChangeText={setRcIssued} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>RC Issued At</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={rcIssuedAt} 
//                     onChangeText={setRcIssuedAt} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//                <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>RC Not Issued why?</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={rcIssueNo} 
//                     onChangeText={setRcIssueNo} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Plate Issued (Yes/No)</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={plateIssued} 
//                     onChangeText={setPlateIssued} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Plate Issued At</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={plateIssuedAt} 
//                     onChangeText={setPlateIssuedAt} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//                  <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Plate Not Issued Why?</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={plateIssueNo} 
//                     onChangeText={setPlateIssueNo} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Tractor Owner (Yes/No)</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={tractorOwner} 
//                     onChangeText={setTractorOwner} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Relative Name</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={relativeName} 
//                     onChangeText={setRelativeName} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Relative Father Name</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={relativeFatherName} 
//                     onChangeText={setRelativeFatherName} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Relative Address</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={relativeAddress} 
//                     onChangeText={setRelativeAddress} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Relative Phone</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={relativePhone} 
//                     onChangeText={setRelativePhone} 
//                     keyboardType="phone-pad" 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Relative Relation</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={relativeRelation} 
//                     onChangeText={setRelativeRelation} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>
//             </>
//           )}

//           {/* PDI specific */}
//           {isPDI && (
//             <>
//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Form Date</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={formDate} 
//                     onChangeText={setFormDate} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Inspector Name</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={inspectorName} 
//                     onChangeText={setInspectorName} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Select Date</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={selectDate} 
//                     onChangeText={setSelectDate} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Tractor Model</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={tractorModel} 
//                     onChangeText={setTractorModel} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Chassis No</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={chassisNo} 
//                     onChangeText={setChassisNo} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Engine No</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={engineNo} 
//                     onChangeText={setEngineNo} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Tire Make</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={tireMake} 
//                     onChangeText={setTireMake} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Tire Make Other</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={tireMakeOther} 
//                     onChangeText={setTireMakeOther} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Front Right Serial No</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={frontRightSerialNo} 
//                     onChangeText={setFrontRightSerialNo} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>
//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Front Left Serial No</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={frontLeftSerialNo} 
//                     onChangeText={setFrontLeftSerialNo} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>
//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Rear Right Serial No</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={rearRightSerialNo} 
//                     onChangeText={setRearRightSerialNo} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>
//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Rear Left Serial No</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={rearLeftSerialNo} 
//                     onChangeText={setRearLeftSerialNo} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Battery Make</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={batteryMake} 
//                     onChangeText={setBatteryMake} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Battery Make Other</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={batteryMakeOther} 
//                     onChangeText={setBatteryMakeOther} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Battery Date</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={batteryDate} 
//                     onChangeText={setBatteryDate} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Battery Serial No</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={batterySerialNo} 
//                     onChangeText={setBatterySerialNo} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Tractor Starter Serial No</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={tractorStarterSerialNo} 
//                     onChangeText={setTractorStarterSerialNo} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>FIP No</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={fipNo} 
//                     onChangeText={setFipNo} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Tractor Alternator No</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={tractorAlternatorNo} 
//                     onChangeText={setTractorAlternatorNo} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Lights OK (Yes/No)</Text>
//                 <View style={styles.inputField}>
//                   <TextInput
//                     style={styles.inputText}
//                     value={lightsOk}
//                     onChangeText={(v) => setLightsOk(v)}
//                     placeholder="Yes or No"
//                     autoCapitalize="none"
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Nuts OK (Yes/No)</Text>
//                 <View style={styles.inputField}>
//                   <TextInput
//                     style={styles.inputText}
//                     value={nutsOk}
//                     onChangeText={(v) => setNutsOk(v)}
//                     placeholder="Yes or No"
//                     autoCapitalize="none"
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Hydraulic Oil (Yes/No)</Text>
//                 <View style={styles.inputField}>
//                   <TextInput
//                     style={styles.inputText}
//                     value={hydraulicOil}
//                     onChangeText={(v) => setHydraulicOil(v)}
//                     placeholder="Yes or No"
//                     autoCapitalize="none"
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>All Nuts Sealed (Yes/No)</Text>
//                 <View style={styles.inputField}>
//                   <TextInput
//                     style={styles.inputText}
//                     value={allNutsSealed}
//                     onChangeText={(v) => setAllNutsSealed(v)}
//                     placeholder="Yes or No"
//                     autoCapitalize="none"
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Tractor Delivered (Yes/No)</Text>
//                 <View style={styles.inputField}>
//                   <TextInput
//                     style={styles.inputText}
//                     value={tractorDelivered}
//                     onChangeText={(v) => setTractorDelivered(v)}
//                     placeholder="Yes or No"
//                     autoCapitalize="none"
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Delivery Date</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={deliveryDate} 
//                     onChangeText={setDeliveryDate} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Dealer Name</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={dealerName} 
//                     onChangeText={setDealerName} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Customer Father Name</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={customerFatherName} 
//                     onChangeText={setCustomerFatherName} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Customer Address</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={customerAddress} 
//                     onChangeText={setCustomerAddress} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Customer Contact</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={customerContact} 
//                     onChangeText={setCustomerContact} 
//                     keyboardType="phone-pad" 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Hypothecation</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={hypothecationPDI} 
//                     onChangeText={setHypothecationPDI} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Hypothecation Other</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={hypothecationOtherPDI} 
//                     onChangeText={setHypothecationOtherPDI} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Engine Oil Level (Yes/No)</Text>
//                 <View style={styles.inputField}>
//                   <TextInput
//                     style={styles.inputText}
//                     value={engineOilLevel}
//                     onChangeText={(v) => setEngineOilLevel(v)}
//                     placeholder="Yes or No"
//                     autoCapitalize="none"
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Coolant Level (Yes/No)</Text>
//                 <View style={styles.inputField}>
//                   <TextInput
//                     style={styles.inputText}
//                     value={coolantLevel}
//                     onChangeText={(v) => setCoolantLevel(v)}
//                     placeholder="Yes or No"
//                     autoCapitalize="none"
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Brake Fluid Level (Yes/No)</Text>
//                 <View style={styles.inputField}>
//                   <TextInput
//                     style={styles.inputText}
//                     value={brakeFluidLevel}
//                     onChangeText={(v) => setBrakeFluidLevel(v)}
//                     placeholder="Yes or No"
//                     autoCapitalize="none"
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Greasing Done (Yes/No)</Text>
//                 <View style={styles.inputField}>
//                   <TextInput
//                     style={styles.inputText}
//                     value={greasingDone}
//                     onChangeText={(v) => setGreasingDone(v)}
//                     placeholder="Yes or No"
//                     autoCapitalize="none"
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Paint Scratches (Yes/No)</Text>
//                 <View style={styles.inputField}>
//                   <TextInput
//                     style={styles.inputText}
//                     value={paintScratches}
//                     onChangeText={(v) => setPaintScratches(v)}
//                     placeholder="Yes or No"
//                     autoCapitalize="none"
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Toolkit Available (Yes/No)</Text>
//                 <View style={styles.inputField}>
//                   <TextInput
//                     style={styles.inputText}
//                     value={toolkitAvailable}
//                     onChangeText={(v) => setToolkitAvailable(v)}
//                     placeholder="Yes or No"
//                     autoCapitalize="none"
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Owner Manual Given (Yes/No)</Text>
//                 <View style={styles.inputField}>
//                   <TextInput
//                     style={styles.inputText}
//                     value={ownerManualGiven}
//                     onChangeText={(v) => setOwnerManualGiven(v)}
//                     placeholder="Yes or No"
//                     autoCapitalize="none"
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Reflector Sticker Applied (Yes/No)</Text>
//                 <View style={styles.inputField}>
//                   <TextInput
//                     style={styles.inputText}
//                     value={reflectorStickerApplied}
//                     onChangeText={(v) => setReflectorStickerApplied(v)}
//                     placeholder="Yes or No"
//                     autoCapitalize="none"
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Number Plate Fixed (Yes/No)</Text>
//                 <View style={styles.inputField}>
//                   <TextInput
//                     style={styles.inputText}
//                     value={numberPlateFixed}
//                     onChangeText={(v) => setNumberPlateFixed(v)}
//                     placeholder="Yes or No"
//                     autoCapitalize="none"
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>PDI Done By</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={pdiDoneBy} 
//                     onChangeText={setPdiDoneBy} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Remarks</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={remarks} 
//                     onChangeText={setRemarks} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>
//             </>
//           )}

//           {/* DC specific */}
//           {isDC && (
//             <>
//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Select Date</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={selectDateDC} 
//                     onChangeText={setSelectDateDC} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Delivery Mode</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={deliveryMode} 
//                     onChangeText={setDeliveryMode} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Branch Name</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={branchName} 
//                     onChangeText={setBranchName} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Branch Person Name</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={branchPersonName} 
//                     onChangeText={setBranchPersonName} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Branch Address</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={branchAddress} 
//                     onChangeText={setBranchAddress} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Branch Phone</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={branchPhone} 
//                     onChangeText={setBranchPhone} 
//                     keyboardType="phone-pad" 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Challan Created By</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={challanCreatedBy} 
//                     onChangeText={setChallanCreatedBy} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Customer Name</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={customerName} 
//                     onChangeText={setCustomerName} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Parentage</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={parentage} 
//                     onChangeText={setParentage} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Address</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={address} 
//                     onChangeText={setAddress} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Hypothecation</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={hypothecation} 
//                     onChangeText={setHypothecation} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Hypothecation Other</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={hypothecationOther} 
//                     onChangeText={setHypothecationOther} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Mobile No</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={mobileNo} 
//                     onChangeText={setMobileNo} 
//                     keyboardType="phone-pad" 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Is Customer (true/false)</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={String(isCustomer)} 
//                     onChangeText={(v) => setIsCustomer(v === 'true' || v === '1')} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Relative Name</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={relativeNameDC} 
//                     onChangeText={setRelativeNameDC} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Relative Father Name</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={relativeFatherNameDC} 
//                     onChangeText={setRelativeFatherNameDC} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Relative Address</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={relativeAddressDC} 
//                     onChangeText={setRelativeAddressDC} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Relative Phone</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={relativePhoneDC} 
//                     onChangeText={setRelativePhoneDC} 
//                     keyboardType="phone-pad" 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Relative Relation</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={relativeRelationDC} 
//                     onChangeText={setRelativeRelationDC} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Tractor Name</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={tractorName} 
//                     onChangeText={setTractorName} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Tractor Model</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={tractorModel} 
//                     onChangeText={setTractorModel} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Chassis No</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={chassisNo} 
//                     onChangeText={setChassisNo} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Engine No</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={engineNo} 
//                     onChangeText={setEngineNo} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Year Of Manufacture</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={yearOfManufacture} 
//                     onChangeText={setYearOfManufacture} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Tires Make</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={tireMake} 
//                     onChangeText={setTireMake} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Tire Make Other</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={tireMakeOtherDC} 
//                     onChangeText={setTireMakeOtherDC} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>FIP Make</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={fipMake} 
//                     onChangeText={setFipMake} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>FIP Make Other</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={fipMakeOther} 
//                     onChangeText={setFipMakeOther} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Battery Make</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={batteryMakeDC} 
//                     onChangeText={setBatteryMakeDC} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Battery Make Other</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={batteryMakeOtherDC} 
//                     onChangeText={setBatteryMakeOtherDC} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Deal Price</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={dealPrice} 
//                     onChangeText={setDealPrice} 
//                     keyboardType="numeric" 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Amount Paid</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={amountPaid} 
//                     onChangeText={setAmountPaid} 
//                     keyboardType="numeric" 
//                     editable={editable}
//                   />
//                 </View>
//               </View>
              
//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Finance Amount Paid</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={financeAmountPaid} 
//                     onChangeText={setFinanceAmountPaid} 
//                     keyboardType="numeric" 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Total Paid</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={totalPaid} 
//                     onChangeText={setTotalPaid} 
//                     keyboardType="numeric" 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Balance Amount</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={balanceAmount} 
//                     onChangeText={setBalanceAmount} 
//                     keyboardType="numeric" 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Hypothecation</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={hypothecation} 
//                     onChangeText={setHypothecation} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Hypothecation Other</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={hypothecationOther} 
//                     onChangeText={setHypothecationOther} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>

//               <View style={styles.fieldRow}>
//                 <Text style={styles.fieldLabel}>Payment Status</Text>
//                 <View style={styles.inputField}>
//                   <TextInput 
//                     style={styles.inputText} 
//                     value={paymentStatus} 
//                     onChangeText={setPaymentStatus} 
//                     editable={editable}
//                   />
//                 </View>
//               </View>
//             </>
//           )}
//         </View>

//         {/* Signatures preview and update section */}
//         <View style={{ marginTop: 20 }}>
//           <Text style={styles.sectionTitle}>Signatures</Text>
          
//           {customerSignatureUri ? (
//             <View style={{ marginVertical: 10 }}>
//               <Text style={{ marginBottom: 6, fontWeight: 'bold' }}>Customer Signature</Text>
//               <Image source={{ uri: customerSignatureUri }} style={{ height: 80, width: 220, resizeMode: 'contain', borderWidth: 1, borderColor: '#ccc' }} />
//               {editable && (
//                 <TouchableOpacity 
//                   style={styles.changeSignatureButton} 
//                   onPress={() => showImageSourceOptions(setCustomerSignatureUri)}
//                 >
//                   <Text style={styles.changeSignatureText}>Change Customer Signature</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           ) : (
//             editable && (
//               <View style={{ marginVertical: 10 }}>
//                 <Text style={{ marginBottom: 6, fontWeight: 'bold' }}>Customer Signature</Text>
//                 <TouchableOpacity 
//                   style={styles.addSignatureButton} 
//                   onPress={() => showImageSourceOptions(setCustomerSignatureUri)}
//                 >
//                   <Text style={styles.addSignatureText}>Add Customer Signature</Text>
//                 </TouchableOpacity>
//               </View>
//             )
//           )}
          
//           {managerSignatureUri ? (
//             <View style={{ marginVertical: 10 }}>
//               <Text style={{ marginBottom: 6, fontWeight: 'bold' }}>Manager Signature</Text>
//               <Image source={{ uri: managerSignatureUri }} style={{ height: 80, width: 220, resizeMode: 'contain', borderWidth: 1, borderColor: '#ccc' }} />
//               {editable && (
//                 <TouchableOpacity 
//                   style={styles.changeSignatureButton} 
//                   onPress={() => showImageSourceOptions(setManagerSignatureUri)}
//                 >
//                   <Text style={styles.changeSignatureText}>Change Manager Signature</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           ) : (
//             editable && (
//               <View style={{ marginVertical: 10 }}>
//                 <Text style={{ marginBottom: 6, fontWeight: 'bold' }}>Manager Signature</Text>
//                 <TouchableOpacity 
//                   style={styles.addSignatureButton} 
//                   onPress={() => showImageSourceOptions(setManagerSignatureUri)}
//                 >
//                   <Text style={styles.addSignatureText}>Add Manager Signature</Text>
//                 </TouchableOpacity>
//               </View>
//             )
//           )}
          
//           {isDC && driverSignatureUri ? (
//             <View style={{ marginVertical: 10 }}>
//               <Text style={{ marginBottom: 6, fontWeight: 'bold' }}>Driver Signature</Text>
//               <Image source={{ uri: driverSignatureUri }} style={{ height: 80, width: 220, resizeMode: 'contain', borderWidth: 1, borderColor: '#ccc' }} />
//               {editable && (
//                 <TouchableOpacity 
//                   style={styles.changeSignatureButton} 
//                   onPress={() => showImageSourceOptions(setDriverSignatureUri)}
//                 >
//                   <Text style={styles.changeSignatureText}>Change Driver Signature</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           ) : (
//             isDC && editable && (
//               <View style={{ marginVertical: 10 }}>
//                 <Text style={{ marginBottom: 6, fontWeight: 'bold' }}>Driver Signature</Text>
//                 <TouchableOpacity 
//                   style={styles.addSignatureButton} 
//                   onPress={() => showImageSourceOptions(setDriverSignatureUri)}
//                 >
//                   <Text style={styles.addSignatureText}>Add Driver Signature</Text>
//                 </TouchableOpacity>
//               </View>
//             )
//           )}
//         </View>

//         {/* Action Buttons */}
//         <View style={styles.actionsSection}>
//           {editable ? (
//             <TouchableOpacity style={[styles.actionButton, { marginBottom: 12 }]} onPress={handleUpdate} disabled={updating}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientButton}>
//                 {updating ? <ActivityIndicator color="#fff" /> : (
//                   <View style={styles.buttonWithIcon}>
//                     <Icon name="save" size={20} color="#fff" />
//                     <Text style={styles.actionButtonText}>Update</Text>
//                   </View>
//                 )}
//               </LinearGradient>
//             </TouchableOpacity>
//           ) : (
//             <View style={[styles.actionButton, { marginBottom: 12 }]}>
//               <View style={[styles.disabledButton, styles.gradientButton]}>
//                 <View style={styles.buttonWithIcon}>
//                   <Icon name="lock" size={20} color="#fff" />
//                   <Text style={styles.actionButtonText}>Form Not Editable</Text>
//                 </View>
//               </View>
//             </View>
//           )}

//           <TouchableOpacity style={[styles.actionButton]} onPress={handleHome}>
//             <View style={[styles.secondaryButtonHome, styles.buttonWithIcon]}>
//               <Text style={styles.secondaryButtonText}>Home</Text>
//             </View>
//           </TouchableOpacity>

//           {/* Download PDF button - only show when status is approved */}
//           {currentStatus === 'approved' && (
//             <TouchableOpacity style={[styles.actionButton, { marginTop: 12 }]} onPress={handleDownloadPdf} disabled={downloadingPdf}>
//               <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientButton}>
//                 {downloadingPdf ? <ActivityIndicator color="#fff" /> : (
//                   <View style={styles.buttonWithIcon}>
//                     <Icon name="download" size={20} color="#fff" />
//                     <Text style={styles.actionButtonText}>Download PDF</Text>
//                   </View>
//                 )}
//               </LinearGradient>
//             </TouchableOpacity>
//           )}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'white' },
//   header: { width: '100%', paddingVertical: 12 },
//   headerContent: { paddingHorizontal: 20 },
//   headerTitle: { fontSize: 20, color: '#fff', textAlign: 'center', fontFamily: 'Inter_28pt-SemiBold' },
//   scrollView: { flex: 1, paddingHorizontal: 20 },
//   avatar: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginTop: 20 },
//   customerHeader: { alignItems: 'center', marginVertical: 10, marginBottom: 10 },
//   customerName: { fontSize: 20, color: '#000', fontFamily: 'Inter_28pt-SemiBold' },
//   customerId: { fontSize: 13, color: '#56616D', fontFamily: 'Inter_28pt-SemiBold' },
//   statusText: { 
//     fontSize: 16, 
//     fontWeight: 'bold',
//     marginTop: 5,
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   statusApproved: { backgroundColor: '#4CAF50', color: 'white' },
//   statusPending: { backgroundColor: '#FF9800', color: 'white' },
//   statusRejected: { backgroundColor: '#F44336', color: 'white' },
//   statusEdited: { backgroundColor: '#2196F3', color: 'white' },
//   statusDefault: { backgroundColor: '#9E9E9E', color: 'white' },
//   formSection: { marginBottom: 12 },
//   fieldRow: { marginBottom: 12 },
//   fieldLabel: { fontSize: 13, color: '#505C68', marginBottom: 6, fontFamily: 'Inter_28pt-SemiBold' },
//   inputField: { width: '100%', borderBottomWidth: 0.6, borderColor: '#000000', paddingVertical: 6, paddingHorizontal: 4 },
//   inputText: { fontSize: 15, color: '#000', fontFamily: 'Inter_28pt-Medium' },
//   divider: { height: 1, backgroundColor: '#E6E6E6', marginVertical: 12 },
//   actionsSection: { marginBottom: 30, marginTop: 8 },
//   actionButton: { borderRadius: 8, overflow: 'hidden' },
//   gradientButton: { paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
//   buttonWithIcon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
//   actionButtonText: { color: '#fff', fontSize: 16, fontFamily: 'Inter_28pt-SemiBold' },
//   secondaryButtonHome: { paddingVertical: 14, borderRadius: 8, backgroundColor: '#20AEBC', alignItems: 'center' },
//   secondaryButtonText: { color: 'white', fontSize: 16, fontFamily: 'Inter_28pt-SemiBold' },
//   disabledButton: { backgroundColor: '#9E9E9E' },
//   sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#000' },
//   changeSignatureButton: { 
//     backgroundColor: '#7E5EA9', 
//     padding: 10, 
//     borderRadius: 6, 
//     marginTop: 8,
//     alignSelf: 'flex-start'
//   },
//   changeSignatureText: { color: 'white', fontWeight: 'bold' },
//   addSignatureButton: { 
//     backgroundColor: '#20AEBC', 
//     padding: 15, 
//     borderRadius: 6, 
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderStyle: 'dashed'
//   },
//   addSignatureText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
// });

// export default Forminternalpage;

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Image,
  TextInput,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Share,
  Linking,
  ActionSheetIOS,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const API_BASE_RC = 'https://argosmob.uk/makroo/public/api/v1/rc-no-plate-delivery/form';
const API_BASE_PDI = 'https://argosmob.uk/makroo/public/api/v1/pdi-delivery/form';
const API_BASE_DC = 'https://argosmob.uk/makroo/public/api/v1/delivery-challan/form';

const Forminternalpage = ({ navigation, route }) => {
  const { item = {} } = route.params || {};
  console.log(item);
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // Generic/common fields
  const [formId, setFormId] = useState(null);
  const [userId, setUserId] = useState(item.user_id ?? null);
  const [formNo, setFormNo] = useState(item.form_no ?? '');
  const [formDate, setFormDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhotoUri, setCustomerPhotoUri] = useState(null);
  const [customerSignatureUri, setCustomerSignatureUri] = useState(null);
  const [managerSignatureUri, setManagerSignatureUri] = useState(null);
  const [driverSignatureUri, setDriverSignatureUri] = useState(null);

  // Status state
  const [currentStatus, setCurrentStatus] = useState('');

  // RC-specific fields
  const [employeeName, setEmployeeName] = useState('');
  const [percentage, setPercentage] = useState('');
  const [address, setAddress] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [tractorModel, setTractorModel] = useState('');
  const [selectDate, setSelectDate] = useState('');
  const [hypothecation, setHypothecation] = useState('');
  const [hypothecationOther, setHypothecationOther] = useState('');
  const [chassisNo, setChassisNo] = useState('');
  const [engineNo, setEngineNo] = useState('');
  const [rcIssued, setRcIssued] = useState('');
  const [rcIssuedAt, setRcIssuedAt] = useState('');
  const [rcIssueNo, setRcIssueNo] = useState('');
  const [plateIssued, setPlateIssued] = useState('');
  const [plateIssuedAt, setPlateIssuedAt] = useState('');
  const [plateIssueNo, setPlateIssueNo] = useState('');
  const [tractorOwner, setTractorOwner] = useState('');
  const [relativeName, setRelativeName] = useState('');
  const [relativeFatherName, setRelativeFatherName] = useState('');
  const [relativeAddress, setRelativeAddress] = useState('');
  const [relativePhone, setRelativePhone] = useState('');
  const [relativeRelation, setRelativeRelation] = useState('');
  const [relationOther, setRelationOther] = useState('');
  const [status, setStatus] = useState('');
  const [location, setLocation] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  // PDI-specific fields
  const [inspectorName, setInspectorName] = useState('');
  const [tireMake, setTireMake] = useState('');
  const [tireMakeOther, setTireMakeOther] = useState('');
  const [frontRightSerialNo, setFrontRightSerialNo] = useState('');
  const [frontLeftSerialNo, setFrontLeftSerialNo] = useState('');
  const [rearRightSerialNo, setRearRightSerialNo] = useState('');
  const [rearLeftSerialNo, setRearLeftSerialNo] = useState('');
  const [batteryMake, setBatteryMake] = useState('');
  const [batteryMakeOther, setBatteryMakeOther] = useState('');
  const [batteryDate, setBatteryDate] = useState('');
  const [batterySerialNo, setBatterySerialNo] = useState('');
  const [tractorStarterSerialNo, setTractorStarterSerialNo] = useState('');
  const [fipNo, setFipNo] = useState('');
  const [tractorAlternatorNo, setTractorAlternatorNo] = useState('');
  const [lightsOk, setLightsOk] = useState('');
  const [nutsOk, setNutsOk] = useState('');
  const [hydraulicOil, setHydraulicOil] = useState('');
  const [lightsNo, setLightsNo] = useState('');
  const [nutsNo, setNutsNo] = useState('');
  const [hydraulicOilHalf, setHydraulicOilHalf] = useState('');
  const [allNutsSealed, setAllNutsSealed] = useState('');
  const [allNutsSealedNo, setAllNutsSealedNo] = useState('');
  const [tractorDelivered, setTractorDelivered] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [dealerName, setDealerName] = useState('');
  const [customerFatherName, setCustomerFatherName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [hypothecationPDI, setHypothecationPDI] = useState('');
  const [hypothecationOtherPDI, setHypothecationOtherPDI] = useState('');
  const [engineOilLevel, setEngineOilLevel] = useState('');
  const [coolantLevel, setCoolantLevel] = useState('');
  const [brakeFluidLevel, setBrakeFluidLevel] = useState('');
  const [greasingDone, setGreasingDone] = useState('');
  const [paintScratches, setPaintScratches] = useState('');
  const [toolkitAvailable, setToolkitAvailable] = useState('');
  const [ownerManualGiven, setOwnerManualGiven] = useState('');
  const [reflectorStickerApplied, setReflectorStickerApplied] = useState('');
  const [numberPlateFixed, setNumberPlateFixed] = useState('');
  const [pdiDoneBy, setPdiDoneBy] = useState('');
  const [remarks, setRemarks] = useState('');
  const [statusPDI, setStatusPDI] = useState('');
  const [locationPDI, setLocationPDI] = useState('');
  const [paymentMethodPDI, setPaymentMethodPDI] = useState('');

  // DC-specific fields
  const [selectDateDC, setSelectDateDC] = useState('');
  const [deliveryMode, setDeliveryMode] = useState('');
  const [branchName, setBranchName] = useState('');
  const [branchPersonName, setBranchPersonName] = useState('');
  const [branchAddress, setBranchAddress] = useState('');
  const [branchPhone, setBranchPhone] = useState('');
  const [challanCreatedBy, setChallanCreatedBy] = useState('');
  const [parentage, setParentage] = useState('');
  const [isCustomer, setIsCustomer] = useState(false);
  const [relativeNameDC, setRelativeNameDC] = useState('');
  const [relativeFatherNameDC, setRelativeFatherNameDC] = useState('');
  const [relativeAddressDC, setRelativeAddressDC] = useState('');
  const [relativePhoneDC, setRelativePhoneDC] = useState('');
  const [relativeRelationDC, setRelativeRelationDC] = useState('');
  const [relationOtherDC, setRelationOtherDC] = useState('');
  const [tractorName, setTractorName] = useState('');
  const [yearOfManufacture, setYearOfManufacture] = useState('');
  const [fipMake, setFipMake] = useState('');
  const [fipMakeOther, setFipMakeOther] = useState('');
  const [batteryMakeDC, setBatteryMakeDC] = useState('');
  const [batteryMakeOtherDC, setBatteryMakeOtherDC] = useState('');
  const [tireMakeOtherDC, setTireMakeOtherDC] = useState('');
  const [dealPrice, setDealPrice] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [totalPaid, setTotalPaid] = useState('');
  const [balanceAmount, setBalanceAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [financierName, setFinancierName] = useState('');
  const [accessoriesJson, setAccessoriesJson] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [financeAmountPaid, setFinanceAmountPaid] = useState('');
  const [statusDC, setStatusDC] = useState('');
  const [locationDC, setLocationDC] = useState('');
  const [paymentMethodDC, setPaymentMethodDC] = useState('');

  // determine prefix helper
  const prefixOf = (s) => (s ? String(s).trim().toUpperCase().slice(0, 3) : '');

  const pickBaseByFormNo = (fno) => {
    const p = prefixOf(fno);
    if (p.startsWith('RC')) return API_BASE_RC;
    if (p.startsWith('PDI')) return API_BASE_PDI;
    if (p.startsWith('DC')) return API_BASE_DC;
    if (item.form_no) {
      const ip = prefixOf(item.form_no);
      if (ip.startsWith('RC')) return API_BASE_RC;
      if (ip.startsWith('PDI')) return API_BASE_PDI;
      if (ip.startsWith('DC')) return API_BASE_DC;
    }
    return API_BASE_RC;
  };

  useEffect(() => {
    if (!item || !item.id) {
      Alert.alert('No ID', 'item.id is required to fetch form.');
      return;
    }
    const initialFormNo = item.form_no ?? formNo;
    fetchForm(item.id, initialFormNo);
  }, [item]);

  const makeAbsoluteUrl = (relativePath) => {
    if (!relativePath) return null;
    if (relativePath.startsWith('http')) return relativePath;
    return `https://argosmob.uk/makroo/public/${relativePath.replace(/^\/+/, '')}`;
  };

  const boolToYesNo = (val) => {
    if (val === null || val === undefined || val === '') return '';
    if (typeof val === 'number') return val === 1 ? 'Yes' : 'No';
    const s = String(val).trim().toLowerCase();
    if (s === '1' || s === 'true' || s === 'yes' || s === 'y') return 'Yes';
    if (s === '0' || s === 'false' || s === 'no' || s === 'n') return 'No';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const yesNoToServer = (val) => {
    if (!val && val !== '') return '0';
    const s = String(val).trim().toLowerCase();
    return s === 'yes' || s === 'y' ? '1' : '0';
  };

  const fetchForm = async (id, sampleFormNo = '') => {
    setLoading(true);
    try {
      const base = pickBaseByFormNo(sampleFormNo);
      const url = `${base}/get`;

      const data = new FormData();
      data.append('id', String(id));

      const resp = await axios.post(url, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      if (resp?.data?.status && resp.data.data) {
        const d = resp.data.data;

        // common
        setFormId(d.id ?? id);
        setUserId(d.user_id ?? userId);
        setFormNo(d.form_no ?? formNo);
        setFormDate(d.form_date ?? '');
        setCustomerName(d.customer_name ?? '');

        setCustomerPhotoUri(d.customer_photo ? makeAbsoluteUrl(d.customer_photo) : null);
        setCustomerSignatureUri(d.customer_signature ? makeAbsoluteUrl(d.customer_signature) : null);
        setManagerSignatureUri(d.manager_signature ? makeAbsoluteUrl(d.manager_signature) : null);
        setDriverSignatureUri(d.driver_signature ? makeAbsoluteUrl(d.driver_signature) : null);

        // RC mapping
        if (base === API_BASE_RC) {
          setEmployeeName(d.employee_name ?? '');
          setPercentage(String(d.percentage ?? ''));
          setAddress(d.address ?? '');
          setMobileNo(d.mobile_no ?? '');
          setRegistrationNo(d.registration_no ?? '');
          setTractorModel(d.tractor_model ?? '');
          setSelectDate(d.select_date ?? '');
          setHypothecation(d.hypothecation ?? '');
          setHypothecationOther(d.hypothecation_other ?? '');
          setChassisNo(d.chassis_no ?? '');
          setEngineNo(d.engine_no ?? '');
          setRcIssued(boolToYesNo(d.rc_issued ?? ''));
          setRcIssuedAt(d.rc_issued_at ?? '');
          setRcIssueNo(d.rc_issue_no ?? '');
          setPlateIssued(boolToYesNo(d.plate_issued ?? ''));
          setPlateIssuedAt(d.plate_issued_at ?? '');
          setPlateIssueNo(d.plate_issue_no ?? '');
          setTractorOwner(boolToYesNo(d.tractor_owner ?? ''));
          setRelativeName(d.relative_name ?? '');
          setRelativeFatherName(d.relative_father_name ?? '');
          setRelativeAddress(d.relative_address ?? '');
          setRelativePhone(d.relative_phone ?? '');
          setRelativeRelation(d.relative_relation ?? '');
          setRelationOther(d.relation_other ?? '');
          setStatus(d.status ?? '');
          setLocation(d.location ?? '');
          setPaymentMethod(d.payment_method ?? '');
          setCurrentStatus(d.status ?? '');
        }

        // PDI mapping
        if (base === API_BASE_PDI) {
          setInspectorName(d.inspector_name ?? '');
          setSelectDate(d.select_date ?? '');
          setTractorModel(d.tractor_model ?? '');
          setChassisNo(d.chassis_no ?? '');
          setEngineNo(d.engine_no ?? '');
          setTireMake(d.tire_make ?? '');
          setTireMakeOther(d.tire_make_other ?? '');
          setFrontRightSerialNo(d.front_right_serial_no ?? '');
          setFrontLeftSerialNo(d.front_left_serial_no ?? '');
          setRearRightSerialNo(d.rear_right_serial_no ?? '');
          setRearLeftSerialNo(d.rear_left_serial_no ?? '');
          setBatteryMake(d.battery_make ?? '');
          setBatteryMakeOther(d.battery_make_other ?? '');
          setBatteryDate(d.battery_date ?? '');
          setBatterySerialNo(d.battery_serial_no ?? '');
          setTractorStarterSerialNo(d.tractor_starter_serial_no ?? '');
          setFipNo(d.fip_no ?? '');
          setTractorAlternatorNo(d.tractor_alternator_no ?? '');
          setLightsOk(boolToYesNo(d.lights_ok ?? ''));
          setNutsOk(boolToYesNo(d.nuts_ok ?? ''));
          setHydraulicOil(boolToYesNo(d.hydraulic_oil ?? ''));
          setLightsNo(d.lights_no ?? '');
          setNutsNo(d.nuts_no ?? '');
          setHydraulicOilHalf(d.hydraulic_oil_half ?? '');
          setAllNutsSealed(boolToYesNo(d.all_nuts_sealed ?? ''));
          setAllNutsSealedNo(d.all_nuts_sealed_no ?? '');
          setTractorDelivered(boolToYesNo(d.tractor_delivered ?? ''));
          setDeliveryDate(d.delivery_date ?? '');
          setDealerName(d.dealer_name ?? '');
          setCustomerName(d.customer_name ?? '');
          setCustomerFatherName(d.customer_father_name ?? '');
          setCustomerAddress(d.customer_address ?? '');
          setCustomerContact(d.customer_contact ?? '');
          setHypothecationPDI(d.hypothecation ?? '');
          setHypothecationOtherPDI(d.hypothecation_other ?? '');
          setEngineOilLevel(boolToYesNo(d.engine_oil_level ?? ''));
          setCoolantLevel(boolToYesNo(d.coolant_level ?? ''));
          setBrakeFluidLevel(boolToYesNo(d.brake_fluid_level ?? ''));
          setGreasingDone(boolToYesNo(d.greasing_done ?? ''));
          setPaintScratches(boolToYesNo(d.paint_scratches ?? ''));
          setToolkitAvailable(boolToYesNo(d.toolkit_available ?? ''));
          setOwnerManualGiven(boolToYesNo(d.owner_manual_given ?? ''));
          setReflectorStickerApplied(boolToYesNo(d.reflector_sticker_applied ?? ''));
          setNumberPlateFixed(boolToYesNo(d.number_plate_fixed ?? ''));
          setPdiDoneBy(d.pdi_done_by ?? '');
          setRemarks(d.remarks ?? '');
          setStatusPDI(d.status ?? '');
          setLocationPDI(d.location ?? '');
          setPaymentMethodPDI(d.payment_method ?? '');
          setCurrentStatus(d.status ?? '');
        }

        // DC mapping
        if (base === API_BASE_DC) {
          setSelectDateDC(d.select_date ?? '');
          setDeliveryMode(d.delivery_mode ?? '');
          setBranchName(d.branch_name ?? '');
          setBranchPersonName(d.branch_person_name ?? '');
          setBranchAddress(d.branch_address ?? '');
          setBranchPhone(d.branch_phone ?? '');
          setChallanCreatedBy(d.challan_created_by ?? '');
          setCustomerName(d.customer_name ?? '');
          setParentage(d.parentage ?? '');
          setAddress(d.address ?? '');
          setHypothecation(d.hypothecation ?? '');
          setHypothecationOther(d.hypothecation_other ?? '');
          setMobileNo(d.mobile_no ?? '');
          setIsCustomer(Boolean(d.is_customer));
          setRelativeNameDC(d.relative_name ?? '');
          setRelativeFatherNameDC(d.relative_father_name ?? '');
          setRelativeAddressDC(d.relative_address ?? '');
          setRelativePhoneDC(d.relative_phone ?? '');
          setRelativeRelationDC(d.relative_relation ?? '');
          setRelationOtherDC(d.relation_other ?? '');
          setTractorName(d.tractor_name ?? '');
          setTractorModel(d.tractor_model ?? '');
          setChassisNo(d.chassis_no ?? '');
          setEngineNo(d.engine_no ?? '');
          setYearOfManufacture(d.year_of_manufacture ?? '');
          setTireMake(d.tire_make ?? '');
          setTireMakeOtherDC(d.tire_make_other ?? '');
          setFipMake(d.fip_make ?? '');
          setFipMakeOther(d.fip_make_other ?? '');
          setBatteryMakeDC(d.battery_make ?? '');
          setBatteryMakeOtherDC(d.battery_make_other ?? '');
          setDealPrice(String(d.deal_price ?? ''));
          setAmountPaid(String(d.amount_paid ?? ''));
          setTotalPaid(String(d.total_paid ?? ''));
          setBalanceAmount(String(d.balance_amount ?? ''));
          setPaymentStatus(d.payment_status ?? '');
          setFinancierName(d.financier_name ?? '');
          setAccessoriesJson(d.accessories ?? '');
          setTermsAccepted(Boolean(d.terms_accepted));
          setRemarks(d.remarks ?? '');
          setFinanceAmountPaid(String(d.finance_amount_paid ?? ''));
          setStatusDC(d.status ?? '');
          setLocationDC(d.location ?? '');
          setPaymentMethodDC(d.payment_method ?? '');
          setCurrentStatus(d.status ?? '');
        }
      } else {
        Alert.alert('Fetch failed', resp?.data?.message ?? 'Failed to fetch record');
      }
    } catch (err) {
      console.warn('fetchForm error', err);
      Alert.alert('Error', 'Network/server error while fetching form.');
    } finally {
      setLoading(false);
    }
  };

  const isFormEditable = () => {
    return currentStatus === 'edited';
  };

  const handleUpdate = async () => {
    if (!isFormEditable()) {
      Alert.alert('Cannot Edit', 'This form cannot be edited in its current status.');
      return;
    }

    const base = pickBaseByFormNo(formNo ?? item.form_no ?? '');
    const url = `${base}/update`;

    setUpdating(true);
    try {
      const data = new FormData();
      data.append('id', String(formId ?? item.id ?? ''));
      data.append('form_no', formNo ?? '');
      if (userId) data.append('user_id', String(userId));

      // Common fields
      if (formDate) data.append('form_date', formDate);

      // Append customer photo if it's a local URI (newly selected)
      if (customerPhotoUri && customerPhotoUri.startsWith('file://') && (base === API_BASE_RC || base === API_BASE_PDI)) {
        data.append('customer_photo', {
          uri: customerPhotoUri,
          type: 'image/jpeg',
          name: 'customer_photo.jpg',
        });
      }

      // Append signature images if they are local URIs (newly selected)
      if (customerSignatureUri && customerSignatureUri.startsWith('file://')) {
        data.append('customer_signature', {
          uri: customerSignatureUri,
          type: 'image/jpeg',
          name: 'customer_signature.jpg',
        });
      }

      if (managerSignatureUri && managerSignatureUri.startsWith('file://')) {
        data.append('manager_signature', {
          uri: managerSignatureUri,
          type: 'image/jpeg',
          name: 'manager_signature.jpg',
        });
      }

      if (driverSignatureUri && driverSignatureUri.startsWith('file://') && base === API_BASE_DC) {
        data.append('driver_signature', {
          uri: driverSignatureUri,
          type: 'image/jpeg',
          name: 'driver_signature.jpg',
        });
      }

      if (base === API_BASE_RC) {
        // RC update payload
        if (employeeName) data.append('employee_name', employeeName);
        if (customerName) data.append('customer_name', customerName);
        if (percentage) data.append('percentage', String(percentage));
        if (address) data.append('address', address);
        if (mobileNo) data.append('mobile_no', mobileNo);
        if (registrationNo) data.append('registration_no', registrationNo);
        if (tractorModel) data.append('tractor_model', tractorModel);
        if (selectDate) data.append('select_date', selectDate);
        if (hypothecation) data.append('hypothecation', hypothecation);
        if (hypothecationOther) data.append('hypothecation_other', hypothecationOther);
        if (chassisNo) data.append('chassis_no', chassisNo);
        if (engineNo) data.append('engine_no', engineNo);
        if (rcIssued) data.append('rc_issued', yesNoToServer(rcIssued));
        if (rcIssuedAt) data.append('rc_issued_at', rcIssuedAt);
        if (rcIssueNo) data.append('rc_issue_no', rcIssueNo);
        if (plateIssued) data.append('plate_issued', yesNoToServer(plateIssued));
        if (plateIssuedAt) data.append('plate_issued_at', plateIssuedAt);
        if (plateIssueNo) data.append('plate_issue_no', plateIssueNo);
        if (tractorOwner) data.append('tractor_owner', yesNoToServer(tractorOwner));
        if (relativeName) data.append('relative_name', relativeName);
        if (relativeFatherName) data.append('relative_father_name', relativeFatherName);
        if (relativeAddress) data.append('relative_address', relativeAddress);
        if (relativePhone) data.append('relative_phone', relativePhone);
        if (relativeRelation) data.append('relative_relation', relativeRelation);
        if (relationOther) data.append('relation_other', relationOther);
        if (status) data.append('status', status);
        if (location) data.append('location', location);
        if (paymentMethod) data.append('payment_method', paymentMethod);
      } else if (base === API_BASE_PDI) {
        // PDI update payload
        if (inspectorName) data.append('inspector_name', inspectorName);
        if (selectDate) data.append('select_date', selectDate);
        if (tractorModel) data.append('tractor_model', tractorModel);
        if (chassisNo) data.append('chassis_no', chassisNo);
        if (engineNo) data.append('engine_no', engineNo);
        if (tireMake) data.append('tire_make', tireMake);
        if (tireMakeOther) data.append('tire_make_other', tireMakeOther);
        if (frontRightSerialNo) data.append('front_right_serial_no', frontRightSerialNo);
        if (frontLeftSerialNo) data.append('front_left_serial_no', frontLeftSerialNo);
        if (rearRightSerialNo) data.append('rear_right_serial_no', rearRightSerialNo);
        if (rearLeftSerialNo) data.append('rear_left_serial_no', rearLeftSerialNo);
        if (batteryMake) data.append('battery_make', batteryMake);
        if (batteryMakeOther) data.append('battery_make_other', batteryMakeOther);
        if (batteryDate) data.append('battery_date', batteryDate);
        if (batterySerialNo) data.append('battery_serial_no', batterySerialNo);
        if (tractorStarterSerialNo) data.append('tractor_starter_serial_no', tractorStarterSerialNo);
        if (fipNo) data.append('fip_no', fipNo);
        if (tractorAlternatorNo) data.append('tractor_alternator_no', tractorAlternatorNo);
        if (lightsOk) data.append('lights_ok', yesNoToServer(lightsOk));
        if (nutsOk) data.append('nuts_ok', yesNoToServer(nutsOk));
        if (hydraulicOil) data.append('hydraulic_oil', yesNoToServer(hydraulicOil));
        if (lightsNo) data.append('lights_no', lightsNo);
        if (nutsNo) data.append('nuts_no', nutsNo);
        if (hydraulicOilHalf) data.append('hydraulic_oil_half', hydraulicOilHalf);
        if (allNutsSealed) data.append('all_nuts_sealed', yesNoToServer(allNutsSealed));
        if (allNutsSealedNo) data.append('all_nuts_sealed_no', allNutsSealedNo);
        if (tractorDelivered) data.append('tractor_delivered', yesNoToServer(tractorDelivered));
        if (deliveryDate) data.append('delivery_date', deliveryDate);
        if (dealerName) data.append('dealer_name', dealerName);
        if (customerName) data.append('customer_name', customerName);
        if (customerFatherName) data.append('customer_father_name', customerFatherName);
        if (customerAddress) data.append('customer_address', customerAddress);
        if (customerContact) data.append('customer_contact', customerContact);
        if (hypothecationPDI) data.append('hypothecation', hypothecationPDI);
        if (hypothecationOtherPDI) data.append('hypothecation_other', hypothecationOtherPDI);
        if (engineOilLevel) data.append('engine_oil_level', yesNoToServer(engineOilLevel));
        if (coolantLevel) data.append('coolant_level', yesNoToServer(coolantLevel));
        if (brakeFluidLevel) data.append('brake_fluid_level', yesNoToServer(brakeFluidLevel));
        if (greasingDone) data.append('greasing_done', yesNoToServer(greasingDone));
        if (paintScratches) data.append('paint_scratches', yesNoToServer(paintScratches));
        if (toolkitAvailable) data.append('toolkit_available', yesNoToServer(toolkitAvailable));
        if (ownerManualGiven) data.append('owner_manual_given', yesNoToServer(ownerManualGiven));
        if (reflectorStickerApplied) data.append('reflector_sticker_applied', yesNoToServer(reflectorStickerApplied));
        if (numberPlateFixed) data.append('number_plate_fixed', yesNoToServer(numberPlateFixed));
        if (pdiDoneBy) data.append('pdi_done_by', pdiDoneBy);
        if (remarks) data.append('remarks', remarks);
        if (statusPDI) data.append('status', statusPDI);
        if (locationPDI) data.append('location', locationPDI);
        if (paymentMethodPDI) data.append('payment_method', paymentMethodPDI);
      } else if (base === API_BASE_DC) {
        // DC update payload
        if (selectDateDC) data.append('select_date', selectDateDC);
        if (deliveryMode) data.append('delivery_mode', deliveryMode);
        if (branchName) data.append('branch_name', branchName);
        if (branchPersonName) data.append('branch_person_name', branchPersonName);
        if (branchAddress) data.append('branch_address', branchAddress);
        if (branchPhone) data.append('branch_phone', branchPhone);
        if (challanCreatedBy) data.append('challan_created_by', challanCreatedBy);
        if (customerName) data.append('customer_name', customerName);
        if (parentage) data.append('parentage', parentage);
        if (address) data.append('address', address);
        if (hypothecation) data.append('hypothecation', hypothecation);
        if (hypothecationOther) data.append('hypothecation_other', hypothecationOther);
        if (mobileNo) data.append('mobile_no', mobileNo);
        data.append('is_customer', isCustomer ? '1' : '0');
        if (relativeNameDC) data.append('relative_name', relativeNameDC);
        if (relativeFatherNameDC) data.append('relative_father_name', relativeFatherNameDC);
        if (relativeAddressDC) data.append('relative_address', relativeAddressDC);
        if (relativePhoneDC) data.append('relative_phone', relativePhoneDC);
        if (relativeRelationDC) data.append('relative_relation', relativeRelationDC);
        if (relationOtherDC) data.append('relation_other', relationOtherDC);
        if (tractorName) data.append('tractor_name', tractorName);
        if (tractorModel) data.append('tractor_model', tractorModel);
        if (chassisNo) data.append('chassis_no', chassisNo);
        if (engineNo) data.append('engine_no', engineNo);
        if (yearOfManufacture) data.append('year_of_manufacture', yearOfManufacture);
        if (tireMake) data.append('tyres_make', tireMake);
        if (tireMakeOtherDC) data.append('tire_make_other', tireMakeOtherDC);
        if (fipMake) data.append('fip_make', fipMake);
        if (fipMakeOther) data.append('fip_make_other', fipMakeOther);
        if (batteryMakeDC) data.append('battery_make', batteryMakeDC);
        if (batteryMakeOtherDC) data.append('battery_make_other', batteryMakeOtherDC);
        if (dealPrice) data.append('deal_price', dealPrice);
        if (amountPaid) data.append('amount_paid', amountPaid);
        if (totalPaid) data.append('total_paid', totalPaid);
        if (balanceAmount) data.append('balance_amount', balanceAmount);
        if (paymentStatus) data.append('payment_status', paymentStatus);
        if (financierName) data.append('financier_name', financierName);
        if (accessoriesJson) data.append('accessories', accessoriesJson);
        data.append('terms_accepted', termsAccepted ? '1' : '0');
        if (remarks) data.append('remarks', remarks);
        if (financeAmountPaid) data.append('finance_amount_paid', financeAmountPaid);
        if (statusDC) data.append('status', statusDC);
        if (locationDC) data.append('location', locationDC);
        if (paymentMethodDC) data.append('payment_method', paymentMethodDC);
      }

      const resp = await axios.post(url, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      if (resp?.data?.status) {
        Alert.alert('Success', resp.data.message ?? 'Updated successfully');
        if (resp.data.data) {
          const d = resp.data.data;
          fetchForm(d.id ?? formId ?? item.id, d.form_no ?? formNo);
        }
      } else {
        Alert.alert('Update failed', resp?.data?.message ?? 'Unknown error during update.');
      }
    } catch (err) {
      console.warn('update error', err);
      Alert.alert('Error', 'Network/server error while updating.');
    } finally {
      setUpdating(false);
    }
  };

  const handleHome = () => {
    navigation.goBack();
  };

  const requestWritePermission = async () => {
    if (Platform.OS !== 'android') return true;

    const androidApiLevel = Platform.Version;
    if (typeof androidApiLevel === 'number' && androidApiLevel >= 30) {
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to storage to download the PDF',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('permission error', err);
      return false;
    }
  };

  const handleDownloadPdf = async () => {
    if (currentStatus !== 'approved') {
      Alert.alert('Download Not Available', 'PDF download is only available for approved forms.');
      return;
    }

    const base = pickBaseByFormNo(formNo ?? item.form_no ?? '');
    const idToUse = formId ?? item.id;
    if (!idToUse) {
      Alert.alert('Missing ID', 'Cannot download PDF: missing form id.');
      return;
    }

    const generateUrl = `${base}/generate-pdf/${encodeURIComponent(String(idToUse))}`;

    setDownloadingPdf(true);

    const hasPerm = await requestWritePermission();
    if (!hasPerm) {
      setDownloadingPdf(false);
      Alert.alert('Permission denied', 'Storage permission is required to save the PDF.');
      return;
    }

    try {
      const resp = await axios.get(generateUrl, {
        responseType: 'arraybuffer',
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        validateStatus: (status) => status >= 200 && status < 400,
      });

      let maybeJson = null;
      try {
        const text = Buffer.from(resp.data).toString('utf8');
        maybeJson = JSON.parse(text);
      } catch (e) {
        maybeJson = null;
      }

      if (maybeJson && (maybeJson.pdf_link || maybeJson.download_url)) {
        const remoteUrl = String(maybeJson.pdf_link ?? maybeJson.download_url).trim();
        const safeRemoteUrl = encodeURI(remoteUrl);

        try {
          await Linking.openURL(safeRemoteUrl);
          setDownloadingPdf(false);
          return;
        } catch (linkErr) {
          console.warn('Linking.openURL failed - falling back to download', linkErr);
        }

        const fallbackFileName = `form_${formNo || idToUse || Date.now()}.pdf`;
        const docPath = `${RNFS.DocumentDirectoryPath}/${fallbackFileName}`;
        const androidDownloadsPath = RNFS.DownloadDirectoryPath ? `${RNFS.DownloadDirectoryPath}/${fallbackFileName}` : null;
        let destPath = docPath;
        if (Platform.OS === 'android' && androidDownloadsPath) {
          destPath = androidDownloadsPath;
        }

        const dl = RNFS.downloadFile({ fromUrl: safeRemoteUrl, toFile: destPath });
        const result = await dl.promise;
        if (result && (result.statusCode === 200 || result.statusCode === 201)) {
          const shareUrl = Platform.OS === 'android' ? 'file://' + destPath : destPath;
          await Share.share({ url: shareUrl, title: 'Form PDF' });
          setDownloadingPdf(false);
          return;
        } else {
          const dl2 = RNFS.downloadFile({ fromUrl: safeRemoteUrl, toFile: docPath });
          const r2 = await dl2.promise;
          if (r2 && (r2.statusCode === 200 || r2.statusCode === 201)) {
            const shareUrl = Platform.OS === 'android' ? 'file://' + docPath : docPath;
            await Share.share({ url: shareUrl, title: 'Form PDF' });
            setDownloadingPdf(false);
            return;
          }
          throw new Error('Failed to download file from remote URL');
        }
      }

      const fallbackFileName = `form_${formNo || idToUse || Date.now()}.pdf`;
      const docPath = `${RNFS.DocumentDirectoryPath}/${fallbackFileName}`;
      const androidDownloadsPath = RNFS.DownloadDirectoryPath ? `${RNFS.DownloadDirectoryPath}/${fallbackFileName}` : null;

      let writePath = docPath;
      if (Platform.OS === 'android' && androidDownloadsPath) {
        writePath = androidDownloadsPath;
      }

      const base64 = Buffer.from(resp.data, 'binary').toString('base64');
      await RNFS.writeFile(writePath, base64, 'base64');

      const fileUrl = Platform.OS === 'android' ? 'file://' + writePath : writePath;
      try {
        await Linking.openURL(fileUrl);
        setDownloadingPdf(false);
        return;
      } catch (openErr) {
        console.warn('Opening saved file directly failed, falling back to Share', openErr);
      }

      await Share.share({ url: 'file://' + writePath, title: 'Form PDF' });
    } catch (err) {
      console.warn('download pdf error', err);
      Alert.alert('Download failed', `Unable to download or open PDF. Check endpoint or network.\n\nURL: ${generateUrl}`);
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Request camera permission for Android
  const requestCameraPermission = async () => {
    if (Platform.OS !== 'android') return true;
    
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera to take photos',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('camera permission error', err);
      return false;
    }
  };

  // Show image source options (camera or gallery)
  const showImageSourceOptions = (setImageUri, title = 'Select Image Source') => {
    if (!isFormEditable()) {
      Alert.alert('Cannot Edit', 'This form cannot be edited in its current status.');
      return;
    }

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            // Take Photo
            const hasPermission = await requestCameraPermission();
            if (!hasPermission) {
              Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
              return;
            }
            openCamera(setImageUri);
          } else if (buttonIndex === 2) {
            // Choose from Gallery
            openGallery(setImageUri);
          }
        }
      );
    } else {
      // Android
      Alert.alert(
        title,
        'Choose how you want to capture the image',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Take Photo', 
            onPress: async () => {
              const hasPermission = await requestCameraPermission();
              if (!hasPermission) {
                Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
                return;
              }
              openCamera(setImageUri);
            } 
          },
          { 
            text: 'Choose from Gallery', 
            onPress: () => openGallery(setImageUri) 
          },
        ]
      );
    }
  };

  // Open camera to capture image
  const openCamera = (setImageUri) => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
      cameraType: 'back',
      saveToPhotos: false,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
        Alert.alert('Error', 'Failed to capture image');
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setImageUri(uri);
      }
    });
  };

  // Open gallery to choose image
  const openGallery = (setImageUri) => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        Alert.alert('Error', 'Failed to pick image');
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setImageUri(uri);
      }
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const currentBase = pickBaseByFormNo(formNo ?? item.form_no ?? '');
  const isRC = currentBase === API_BASE_RC;
  const isPDI = currentBase === API_BASE_PDI;
  const isDC = currentBase === API_BASE_DC;
  const editable = isFormEditable();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar backgroundColor="#7E5EA9" barStyle="dark-content" />
      <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Customer Profile</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Customer Photo Section with Edit Option for RC and PDI */}
        <View style={styles.photoSection}>
          {customerPhotoUri ? (
            <View style={styles.photoContainer}>
              <Image source={{ uri: customerPhotoUri }} style={styles.avatar} />
              {(isRC || isPDI) && editable && (
                <TouchableOpacity 
                  style={styles.changePhotoButton} 
                  onPress={() => showImageSourceOptions(setCustomerPhotoUri, 'Update Customer Photo')}
                >
                  <Text style={styles.changePhotoText}>Change Photo</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.photoContainer}>
              <Image source={require('../Asset/Images/c10.png')} style={styles.avatar} />
              {(isRC || isPDI) && editable && (
                <TouchableOpacity 
                  style={styles.addPhotoButton} 
                  onPress={() => showImageSourceOptions(setCustomerPhotoUri, 'Add Customer Photo')}
                >
                  <Text style={styles.addPhotoText}>Add Customer Photo</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <View style={styles.customerHeader}>
          <Text style={styles.customerName}>{customerName || '—'}</Text>
          <Text style={styles.customerId}>Form: {formNo || '—'}</Text>
          <Text style={[styles.statusText, 
            currentStatus === 'approved' ? styles.statusApproved :
            currentStatus === 'pending' ? styles.statusPending :
            currentStatus === 'rejected' ? styles.statusRejected :
            currentStatus === 'edited' ? styles.statusEdited :
            styles.statusDefault
          ]}>
            Status: {currentStatus || '—'}
          </Text>
        </View>

        <View style={styles.formSection}>
          {/* RC specific */}
          {isRC && (
            <>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Form Date</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={formDate} 
                    onChangeText={setFormDate} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Employee Name</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={employeeName} 
                    onChangeText={setEmployeeName} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Customer Name</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={customerName} 
                    onChangeText={setCustomerName} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Percentage</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={percentage} 
                    onChangeText={setPercentage} 
                    keyboardType="numeric" 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Address</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={address} 
                    onChangeText={setAddress} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Mobile No</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={mobileNo} 
                    onChangeText={setMobileNo} 
                    keyboardType="phone-pad" 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Registration No</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={registrationNo} 
                    onChangeText={setRegistrationNo} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Tractor Model</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={tractorModel} 
                    onChangeText={setTractorModel} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Select Date</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={selectDate} 
                    onChangeText={setSelectDate} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Hypothecation</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={hypothecation} 
                    onChangeText={setHypothecation} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Hypothecation Other</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={hypothecationOther} 
                    onChangeText={setHypothecationOther} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Chassis No</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={chassisNo} 
                    onChangeText={setChassisNo} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Engine No</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={engineNo} 
                    onChangeText={setEngineNo} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>RC Issued (Yes/No)</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={rcIssued} 
                    onChangeText={setRcIssued} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>RC Issued At</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={rcIssuedAt} 
                    onChangeText={setRcIssuedAt} 
                    editable={editable}
                  />
                </View>
              </View>

               <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>RC Not Issued why?</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={rcIssueNo} 
                    onChangeText={setRcIssueNo} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Plate Issued (Yes/No)</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={plateIssued} 
                    onChangeText={setPlateIssued} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Plate Issued At</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={plateIssuedAt} 
                    onChangeText={setPlateIssuedAt} 
                    editable={editable}
                  />
                </View>
              </View>

                 <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Plate Not Issued Why?</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={plateIssueNo} 
                    onChangeText={setPlateIssueNo} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Tractor Owner (Yes/No)</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={tractorOwner} 
                    onChangeText={setTractorOwner} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Relative Name</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={relativeName} 
                    onChangeText={setRelativeName} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Relative Father Name</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={relativeFatherName} 
                    onChangeText={setRelativeFatherName} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Relative Address</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={relativeAddress} 
                    onChangeText={setRelativeAddress} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Relative Phone</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={relativePhone} 
                    onChangeText={setRelativePhone} 
                    keyboardType="phone-pad" 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Relative Relation</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={relativeRelation} 
                    onChangeText={setRelativeRelation} 
                    editable={editable}
                  />
                </View>
              </View>
            </>
          )}

          {/* PDI specific */}
          {isPDI && (
            <>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Form Date</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={formDate} 
                    onChangeText={setFormDate} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Inspector Name</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={inspectorName} 
                    onChangeText={setInspectorName} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Select Date</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={selectDate} 
                    onChangeText={setSelectDate} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Tractor Model</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={tractorModel} 
                    onChangeText={setTractorModel} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Chassis No</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={chassisNo} 
                    onChangeText={setChassisNo} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Engine No</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={engineNo} 
                    onChangeText={setEngineNo} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Tire Make</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={tireMake} 
                    onChangeText={setTireMake} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Tire Make Other</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={tireMakeOther} 
                    onChangeText={setTireMakeOther} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Front Right Serial No</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={frontRightSerialNo} 
                    onChangeText={setFrontRightSerialNo} 
                    editable={editable}
                  />
                </View>
              </View>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Front Left Serial No</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={frontLeftSerialNo} 
                    onChangeText={setFrontLeftSerialNo} 
                    editable={editable}
                  />
                </View>
              </View>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Rear Right Serial No</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={rearRightSerialNo} 
                    onChangeText={setRearRightSerialNo} 
                    editable={editable}
                  />
                </View>
              </View>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Rear Left Serial No</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={rearLeftSerialNo} 
                    onChangeText={setRearLeftSerialNo} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Battery Make</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={batteryMake} 
                    onChangeText={setBatteryMake} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Battery Make Other</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={batteryMakeOther} 
                    onChangeText={setBatteryMakeOther} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Battery Date</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={batteryDate} 
                    onChangeText={setBatteryDate} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Battery Serial No</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={batterySerialNo} 
                    onChangeText={setBatterySerialNo} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Tractor Starter Serial No</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={tractorStarterSerialNo} 
                    onChangeText={setTractorStarterSerialNo} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>FIP No</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={fipNo} 
                    onChangeText={setFipNo} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Tractor Alternator No</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={tractorAlternatorNo} 
                    onChangeText={setTractorAlternatorNo} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Lights OK (Yes/No)</Text>
                <View style={styles.inputField}>
                  <TextInput
                    style={styles.inputText}
                    value={lightsOk}
                    onChangeText={(v) => setLightsOk(v)}
                    placeholder="Yes or No"
                    autoCapitalize="none"
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Nuts OK (Yes/No)</Text>
                <View style={styles.inputField}>
                  <TextInput
                    style={styles.inputText}
                    value={nutsOk}
                    onChangeText={(v) => setNutsOk(v)}
                    placeholder="Yes or No"
                    autoCapitalize="none"
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Hydraulic Oil (Yes/No)</Text>
                <View style={styles.inputField}>
                  <TextInput
                    style={styles.inputText}
                    value={hydraulicOil}
                    onChangeText={(v) => setHydraulicOil(v)}
                    placeholder="Yes or No"
                    autoCapitalize="none"
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>All Nuts Sealed (Yes/No)</Text>
                <View style={styles.inputField}>
                  <TextInput
                    style={styles.inputText}
                    value={allNutsSealed}
                    onChangeText={(v) => setAllNutsSealed(v)}
                    placeholder="Yes or No"
                    autoCapitalize="none"
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Tractor Delivered (Yes/No)</Text>
                <View style={styles.inputField}>
                  <TextInput
                    style={styles.inputText}
                    value={tractorDelivered}
                    onChangeText={(v) => setTractorDelivered(v)}
                    placeholder="Yes or No"
                    autoCapitalize="none"
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Delivery Date</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={deliveryDate} 
                    onChangeText={setDeliveryDate} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Dealer Name</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={dealerName} 
                    onChangeText={setDealerName} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Customer Father Name</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={customerFatherName} 
                    onChangeText={setCustomerFatherName} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Customer Address</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={customerAddress} 
                    onChangeText={setCustomerAddress} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Customer Contact</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={customerContact} 
                    onChangeText={setCustomerContact} 
                    keyboardType="phone-pad" 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Hypothecation</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={hypothecationPDI} 
                    onChangeText={setHypothecationPDI} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Hypothecation Other</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={hypothecationOtherPDI} 
                    onChangeText={setHypothecationOtherPDI} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Engine Oil Level (Yes/No)</Text>
                <View style={styles.inputField}>
                  <TextInput
                    style={styles.inputText}
                    value={engineOilLevel}
                    onChangeText={(v) => setEngineOilLevel(v)}
                    placeholder="Yes or No"
                    autoCapitalize="none"
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Coolant Level (Yes/No)</Text>
                <View style={styles.inputField}>
                  <TextInput
                    style={styles.inputText}
                    value={coolantLevel}
                    onChangeText={(v) => setCoolantLevel(v)}
                    placeholder="Yes or No"
                    autoCapitalize="none"
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Brake Fluid Level (Yes/No)</Text>
                <View style={styles.inputField}>
                  <TextInput
                    style={styles.inputText}
                    value={brakeFluidLevel}
                    onChangeText={(v) => setBrakeFluidLevel(v)}
                    placeholder="Yes or No"
                    autoCapitalize="none"
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Greasing Done (Yes/No)</Text>
                <View style={styles.inputField}>
                  <TextInput
                    style={styles.inputText}
                    value={greasingDone}
                    onChangeText={(v) => setGreasingDone(v)}
                    placeholder="Yes or No"
                    autoCapitalize="none"
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Paint Scratches (Yes/No)</Text>
                <View style={styles.inputField}>
                  <TextInput
                    style={styles.inputText}
                    value={paintScratches}
                    onChangeText={(v) => setPaintScratches(v)}
                    placeholder="Yes or No"
                    autoCapitalize="none"
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Toolkit Available (Yes/No)</Text>
                <View style={styles.inputField}>
                  <TextInput
                    style={styles.inputText}
                    value={toolkitAvailable}
                    onChangeText={(v) => setToolkitAvailable(v)}
                    placeholder="Yes or No"
                    autoCapitalize="none"
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Owner Manual Given (Yes/No)</Text>
                <View style={styles.inputField}>
                  <TextInput
                    style={styles.inputText}
                    value={ownerManualGiven}
                    onChangeText={(v) => setOwnerManualGiven(v)}
                    placeholder="Yes or No"
                    autoCapitalize="none"
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Reflector Sticker Applied (Yes/No)</Text>
                <View style={styles.inputField}>
                  <TextInput
                    style={styles.inputText}
                    value={reflectorStickerApplied}
                    onChangeText={(v) => setReflectorStickerApplied(v)}
                    placeholder="Yes or No"
                    autoCapitalize="none"
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Number Plate Fixed (Yes/No)</Text>
                <View style={styles.inputField}>
                  <TextInput
                    style={styles.inputText}
                    value={numberPlateFixed}
                    onChangeText={(v) => setNumberPlateFixed(v)}
                    placeholder="Yes or No"
                    autoCapitalize="none"
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>PDI Done By</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={pdiDoneBy} 
                    onChangeText={setPdiDoneBy} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Remarks</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={remarks} 
                    onChangeText={setRemarks} 
                    editable={editable}
                  />
                </View>
              </View>
            </>
          )}

          {/* DC specific */}
          {isDC && (
            <>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Select Date</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={selectDateDC} 
                    onChangeText={setSelectDateDC} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Delivery Mode</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={deliveryMode} 
                    onChangeText={setDeliveryMode} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Branch Name</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={branchName} 
                    onChangeText={setBranchName} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Branch Person Name</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={branchPersonName} 
                    onChangeText={setBranchPersonName} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Branch Address</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={branchAddress} 
                    onChangeText={setBranchAddress} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Branch Phone</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={branchPhone} 
                    onChangeText={setBranchPhone} 
                    keyboardType="phone-pad" 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Challan Created By</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={challanCreatedBy} 
                    onChangeText={setChallanCreatedBy} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Customer Name</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={customerName} 
                    onChangeText={setCustomerName} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Parentage</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={parentage} 
                    onChangeText={setParentage} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Address</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={address} 
                    onChangeText={setAddress} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Hypothecation</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={hypothecation} 
                    onChangeText={setHypothecation} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Hypothecation Other</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={hypothecationOther} 
                    onChangeText={setHypothecationOther} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Mobile No</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={mobileNo} 
                    onChangeText={setMobileNo} 
                    keyboardType="phone-pad" 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Is Customer (true/false)</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={String(isCustomer)} 
                    onChangeText={(v) => setIsCustomer(v === 'true' || v === '1')} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Relative Name</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={relativeNameDC} 
                    onChangeText={setRelativeNameDC} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Relative Father Name</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={relativeFatherNameDC} 
                    onChangeText={setRelativeFatherNameDC} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Relative Address</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={relativeAddressDC} 
                    onChangeText={setRelativeAddressDC} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Relative Phone</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={relativePhoneDC} 
                    onChangeText={setRelativePhoneDC} 
                    keyboardType="phone-pad" 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Relative Relation</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={relativeRelationDC} 
                    onChangeText={setRelativeRelationDC} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Tractor Name</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={tractorName} 
                    onChangeText={setTractorName} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Tractor Model</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={tractorModel} 
                    onChangeText={setTractorModel} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Chassis No</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={chassisNo} 
                    onChangeText={setChassisNo} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Engine No</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={engineNo} 
                    onChangeText={setEngineNo} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Year Of Manufacture</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={yearOfManufacture} 
                    onChangeText={setYearOfManufacture} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Tires Make</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={tireMake} 
                    onChangeText={setTireMake} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Tire Make Other</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={tireMakeOtherDC} 
                    onChangeText={setTireMakeOtherDC} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>FIP Make</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={fipMake} 
                    onChangeText={setFipMake} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>FIP Make Other</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={fipMakeOther} 
                    onChangeText={setFipMakeOther} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Battery Make</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={batteryMakeDC} 
                    onChangeText={setBatteryMakeDC} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Battery Make Other</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={batteryMakeOtherDC} 
                    onChangeText={setBatteryMakeOtherDC} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Deal Price</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={dealPrice} 
                    onChangeText={setDealPrice} 
                    keyboardType="numeric" 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Amount Paid</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={amountPaid} 
                    onChangeText={setAmountPaid} 
                    keyboardType="numeric" 
                    editable={editable}
                  />
                </View>
              </View>
              
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Finance Amount Paid</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={financeAmountPaid} 
                    onChangeText={setFinanceAmountPaid} 
                    keyboardType="numeric" 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Total Paid</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={totalPaid} 
                    onChangeText={setTotalPaid} 
                    keyboardType="numeric" 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Balance Amount</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={balanceAmount} 
                    onChangeText={setBalanceAmount} 
                    keyboardType="numeric" 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Hypothecation</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={hypothecation} 
                    onChangeText={setHypothecation} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Hypothecation Other</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={hypothecationOther} 
                    onChangeText={setHypothecationOther} 
                    editable={editable}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Payment Status</Text>
                <View style={styles.inputField}>
                  <TextInput 
                    style={styles.inputText} 
                    value={paymentStatus} 
                    onChangeText={setPaymentStatus} 
                    editable={editable}
                  />
                </View>
              </View>
            </>
          )}
        </View>

        {/* Signatures preview and update section */}
        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionTitle}>Signatures</Text>
          
          {customerSignatureUri ? (
            <View style={{ marginVertical: 10 }}>
              <Text style={{ marginBottom: 6, fontWeight: 'bold' }}>Customer Signature</Text>
              <Image source={{ uri: customerSignatureUri }} style={{ height: 80, width: 220, resizeMode: 'contain', borderWidth: 1, borderColor: '#ccc' }} />
              {editable && (
                <TouchableOpacity 
                  style={styles.changeSignatureButton} 
                  onPress={() => showImageSourceOptions(setCustomerSignatureUri, 'Update Customer Signature')}
                >
                  <Text style={styles.changeSignatureText}>Change Customer Signature</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            editable && (
              <View style={{ marginVertical: 10 }}>
                <Text style={{ marginBottom: 6, fontWeight: 'bold' }}>Customer Signature</Text>
                <TouchableOpacity 
                  style={styles.addSignatureButton} 
                  onPress={() => showImageSourceOptions(setCustomerSignatureUri, 'Add Customer Signature')}
                >
                  <Text style={styles.addSignatureText}>Add Customer Signature</Text>
                </TouchableOpacity>
              </View>
            )
          )}
          
          {managerSignatureUri ? (
            <View style={{ marginVertical: 10 }}>
              <Text style={{ marginBottom: 6, fontWeight: 'bold' }}>Manager Signature</Text>
              <Image source={{ uri: managerSignatureUri }} style={{ height: 80, width: 220, resizeMode: 'contain', borderWidth: 1, borderColor: '#ccc' }} />
              {editable && (
                <TouchableOpacity 
                  style={styles.changeSignatureButton} 
                  onPress={() => showImageSourceOptions(setManagerSignatureUri, 'Update Manager Signature')}
                >
                  <Text style={styles.changeSignatureText}>Change Manager Signature</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            editable && (
              <View style={{ marginVertical: 10 }}>
                <Text style={{ marginBottom: 6, fontWeight: 'bold' }}>Manager Signature</Text>
                <TouchableOpacity 
                  style={styles.addSignatureButton} 
                  onPress={() => showImageSourceOptions(setManagerSignatureUri, 'Add Manager Signature')}
                >
                  <Text style={styles.addSignatureText}>Add Manager Signature</Text>
                </TouchableOpacity>
              </View>
            )
          )}
          
          {isDC && driverSignatureUri ? (
            <View style={{ marginVertical: 10 }}>
              <Text style={{ marginBottom: 6, fontWeight: 'bold' }}>Driver Signature</Text>
              <Image source={{ uri: driverSignatureUri }} style={{ height: 80, width: 220, resizeMode: 'contain', borderWidth: 1, borderColor: '#ccc' }} />
              {editable && (
                <TouchableOpacity 
                  style={styles.changeSignatureButton} 
                  onPress={() => showImageSourceOptions(setDriverSignatureUri, 'Update Driver Signature')}
                >
                  <Text style={styles.changeSignatureText}>Change Driver Signature</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            isDC && editable && (
              <View style={{ marginVertical: 10 }}>
                <Text style={{ marginBottom: 6, fontWeight: 'bold' }}>Driver Signature</Text>
                <TouchableOpacity 
                  style={styles.addSignatureButton} 
                  onPress={() => showImageSourceOptions(setDriverSignatureUri, 'Add Driver Signature')}
                >
                  <Text style={styles.addSignatureText}>Add Driver Signature</Text>
                </TouchableOpacity>
              </View>
            )
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          {editable ? (
            <TouchableOpacity style={[styles.actionButton, { marginBottom: 12 }]} onPress={handleUpdate} disabled={updating}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientButton}>
                {updating ? <ActivityIndicator color="#fff" /> : (
                  <View style={styles.buttonWithIcon}>
                    <Icon name="save" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Update</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={[styles.actionButton, { marginBottom: 12 }]}>
              <View style={[styles.disabledButton, styles.gradientButton]}>
                <View style={styles.buttonWithIcon}>
                  <Icon name="lock" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Form Not Editable</Text>
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity style={[styles.actionButton]} onPress={handleHome}>
            <View style={[styles.secondaryButtonHome, styles.buttonWithIcon]}>
              <Text style={styles.secondaryButtonText}>Home</Text>
            </View>
          </TouchableOpacity>

          {/* Download PDF button - only show when status is approved */}
          {currentStatus === 'approved' && (
            <TouchableOpacity style={[styles.actionButton, { marginTop: 12 }]} onPress={handleDownloadPdf} disabled={downloadingPdf}>
              <LinearGradient colors={['#7E5EA9', '#20AEBC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientButton}>
                {downloadingPdf ? <ActivityIndicator color="#fff" /> : (
                  <View style={styles.buttonWithIcon}>
                    <Icon name="download" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Download PDF</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { width: '100%', paddingVertical: 12 },
  headerContent: { paddingHorizontal: 20 },
  headerTitle: { fontSize: 20, color: '#fff', textAlign: 'center', fontFamily: 'Inter_28pt-SemiBold' },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  photoSection: { alignItems: 'center', marginTop: 20 },
  photoContainer: { alignItems: 'center' },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  changePhotoButton: { 
    backgroundColor: '#7E5EA9', 
    padding: 8, 
    borderRadius: 6, 
    marginTop: 8,
  },
  changePhotoText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  addPhotoButton: { 
    backgroundColor: '#20AEBC', 
    padding: 10, 
    borderRadius: 6, 
    marginTop: 8,
  },
  addPhotoText: { color: 'white', fontWeight: 'bold' },
  customerHeader: { alignItems: 'center', marginVertical: 10, marginBottom: 10 },
  customerName: { fontSize: 20, color: '#000', fontFamily: 'Inter_28pt-SemiBold' },
  customerId: { fontSize: 13, color: '#56616D', fontFamily: 'Inter_28pt-SemiBold' },
  statusText: { 
    fontSize: 16, 
    fontWeight: 'bold',
    marginTop: 5,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusApproved: { backgroundColor: '#4CAF50', color: 'white' },
  statusPending: { backgroundColor: '#FF9800', color: 'white' },
  statusRejected: { backgroundColor: '#F44336', color: 'white' },
  statusEdited: { backgroundColor: '#2196F3', color: 'white' },
  statusDefault: { backgroundColor: '#9E9E9E', color: 'white' },
  formSection: { marginBottom: 12 },
  fieldRow: { marginBottom: 12 },
  fieldLabel: { fontSize: 13, color: '#505C68', marginBottom: 6, fontFamily: 'Inter_28pt-SemiBold' },
  inputField: { width: '100%', borderBottomWidth: 0.6, borderColor: '#000000', paddingVertical: 6, paddingHorizontal: 4 },
  inputText: { fontSize: 15, color: '#000', fontFamily: 'Inter_28pt-Medium' },
  divider: { height: 1, backgroundColor: '#E6E6E6', marginVertical: 12 },
  actionsSection: { marginBottom: 30, marginTop: 8 },
  actionButton: { borderRadius: 8, overflow: 'hidden' },
  gradientButton: { paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  buttonWithIcon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  actionButtonText: { color: '#fff', fontSize: 16, fontFamily: 'Inter_28pt-SemiBold' },
  secondaryButtonHome: { paddingVertical: 14, borderRadius: 8, backgroundColor: '#20AEBC', alignItems: 'center' },
  secondaryButtonText: { color: 'white', fontSize: 16, fontFamily: 'Inter_28pt-SemiBold' },
  disabledButton: { backgroundColor: '#9E9E9E' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#000' },
  changeSignatureButton: { 
    backgroundColor: '#7E5EA9', 
    padding: 10, 
    borderRadius: 6, 
    marginTop: 8,
    alignSelf: 'flex-start'
  },
  changeSignatureText: { color: 'white', fontWeight: 'bold' },
  addSignatureButton: { 
    backgroundColor: '#20AEBC', 
    padding: 15, 
    borderRadius: 6, 
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed'
  },
  addSignatureText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
});

export default Forminternalpage;