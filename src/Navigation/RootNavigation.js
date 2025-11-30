import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from '../Screens/LoginScreen';
import Dashboard from '../Screens/Dashboard';
import Rcpage from '../Screens/Rcpage';
import Customerspage from '../Screens/Customerspage';
import Customerinternalpage from '../Screens/Customerinternalpage';
import PDIPage from '../Screens/PDIPage';
import ExpectedDeliveryPayment from '../Screens/ExpectedDeliveryPayment';
import Formstatus from '../Screens/Formstatus';
import Forminternalpage from '../Screens/Forminternalpage';
import Pdfpage from '../Screens/Pdfpage';
import DeliveryChallan from '../Screens/DeliveryChallan';
import Overview from '../Screens/StockManagement/Overview';
import Overviewinternal from '../Screens/StockManagement/Overviewinternal';
import HamburgerPage from '../Screens/StockManagement/Hamburger';
import StockLocation from '../Screens/StockManagement/StockLocation';
import TransitStatus from '../Screens/StockManagement/TransitStatus';
import Depot from '../Screens/StockManagement/Depot';
import Finance from '../Screens/StockManagement/Finance';
import Report from '../Screens/StockManagement/Report';
import AddModel from '../Screens/StockManagement/AddModel';
import Form from '../Screens/StockManagement/Form';
import StockLocationList from '../Screens/StockManagement/StockLocationList';
import ModelDetail from '../Screens/StockManagement/ModelDetail';
import DepotModelList from '../Screens/StockManagement/DepotModelList';
import ReportModelList from '../Screens/StockManagement/ReportModelList';
import FinanceModelList from '../Screens/StockManagement/FinanceModelList';
import Signup from '../Screens/Signup';
import Forgetpassword from '../Screens/Forgetpassword';
import Profile from '../Screens/Profile';
import GetAllModel from '../Screens/StockManagement/GetAllModel';
import AllDelivery from '../Screens/StockManagement/AllDelivery';
import AddModelStocks from '../Screens/StockManagement/AddModelStocks';
import AllLocation from '../Screens/StockManagement/AllLocation';
import Paymentmanagement from '../Screens/Paymentmanagement';
import Addcustomerpayment from '../Screens/Addcustomerpayment';
import Customerpaymentdetail from '../Screens/Customerpaymentdetails';
import Oldtractormanagement from '../Screens/Oldtractormanagement';
import Addoldtractor from '../Screens/Addoldtractor';
import Oldtractordetails from '../Screens/Oldtractordetails';
import Formstatus1 from '../Screens/Formstatus1';
import Rcformscreen from '../Screens/Rcformscreen';
import Pdiformscreen from '../Screens/Pdiformscreen';
import Dcformscreen from '../Screens/Dcformscreen';
import Rcinternalpage from '../Screens/Rcinternalpage';
import Dcinternalpage from '../Screens/Dcinternalpage';
import Pdiinternalpage from '../Screens/Pdiinternalpage';
import Deliveryforminternalpage from '../Screens/StockManagement/Deliveryforminternalpage';




const Stack = createNativeStackNavigator();

function RootNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{headerShown: false}}
        />
          <Stack.Screen
          name="Rcpage"
          component={Rcpage}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="Customerspage"
          component={Customerspage}
          options={{headerShown: false}}
        />
          <Stack.Screen
          name="Customerinternalpage"
          component={Customerinternalpage}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="PDIPage"
          component={PDIPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ExpectedDeliveryPayment"
          component={ExpectedDeliveryPayment}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Formstatus"
          component={Formstatus}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Forminternalpage"
          component={Forminternalpage}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="Pdfpage"
          component={Pdfpage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DeliveryChallan"
          component={DeliveryChallan}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Overview"
          component={Overview}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Overviewinternal"
          component={Overviewinternal}
          options={{headerShown: false}}
        />
         <Stack.Screen 
          screenOptions={{
    headerShown: false,
    gestureEnabled: true,
    gestureDirection: 'horizontal', // left/right swipe
    animation: 'slide_from_right',
    animationTypeForReplace: 'pop', // smooth back animation
  }}
          name="Hamburger"
          component={HamburgerPage}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="StockLocation"
          component={StockLocation}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="TransitStatus"
          component={TransitStatus}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Depot"
          component={Depot}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Finance"
          component={Finance}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Report"
          component={Report}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddModel"
          component={AddModel}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="Form"
          component={Form}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="StockLocationList"
          component={StockLocationList}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="ModelDetail"
          component={ModelDetail}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="DepotModelList"
          component={DepotModelList}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="ReportModelList"
          component={ReportModelList}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="FinanceModelList"
          component={FinanceModelList}
          options={{headerShown: false}}
        />
          <Stack.Screen
          name="Signup"
          component={Signup}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Forgetpassword"
          component={Forgetpassword}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="Profile"
          component={Profile}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="GetAllModel"
          component={GetAllModel}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="AllDelivery"
          component={AllDelivery}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="AddModelStocks"
          component={AddModelStocks}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AllLocation"
          component={AllLocation}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Paymentmanagement"
          component={Paymentmanagement}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="Addcustomerpayment"
          component={Addcustomerpayment}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="Customerpaymentdetails"
          component={Customerpaymentdetail}
          options={{headerShown: false}}
        />
       
         <Stack.Screen
          name="Oldtractormanagement"
          component={Oldtractormanagement}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Addoldtractor"
          component={Addoldtractor}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Oldtractordetails"
          component={Oldtractordetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Formstatus1"
          component={Formstatus1}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Rcformscreen"
          component={Rcformscreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Pdiformscreen"
          component={Pdiformscreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Dcformscreen"
          component={Dcformscreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Rcinternalpage"
          component={Rcinternalpage}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="Dcinternalpage"
          component={Dcinternalpage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Pdiinternalpage"
          component={Pdiinternalpage}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="Deliveryforminternalpage"
          component={Deliveryforminternalpage}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigation;
