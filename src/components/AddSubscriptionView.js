import React from 'react';
import { StyleSheet, Text, View, ScrollView, ToastAndroid } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import PaymentFormView from './PaymentformView';
import { getCreditCardToken } from '../../api';

const STRIPE_ERROR = 'Payment service error. Try again later.';
const SERVER_ERROR = 'Server error. Try again later.';

export default class AddSubscriptionView extends React.Component {
   
    constructor(props) {
        super(props);
        this.state = {submitted: false };
      }
    onSubmit = async (creditCardInput) => {
        
        // Disable the Submit button after the request is sent
        this.setState({ submitted: true });
        let creditCardToken;
    
        try {

         creditCardToken = await getCreditCardToken(creditCardInput);
          if (creditCardToken.error) {
            ToastAndroid.show(`${creditCardToken.error}`,ToastAndroid.SHORT);
            this.setState({ submitted: false, error: STRIPE_ERROR });
            return;
          }
        } catch (e) {
            ToastAndroid.show(`${e}`,ToastAndroid.SHORT);
          this.setState({ submitted: false, error: STRIPE_ERROR });
          return;
        }
        if(creditCardToken){
            this.setState({ submitted: false });
            ToastAndroid.show(`succesful stripe api hit`,ToastAndroid.SHORT);
        }

      };
    
  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} ref={ref => (this.scrollViewRef = ref)}>
          <View style={styles.textWrapper}>
            <Text style={styles.infoText}>
               Stripe payment functionality 
            </Text>
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.infoText}>
              Subscribe to see the magic number!
            </Text>
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.infoText}>
              Enter details below!
            </Text>
          </View>
          <View style={styles.cardFormWrapper}>
            <PaymentFormView onSubmit={this.onSubmit} submitted={this.state.submitted}/>
          </View>
        </ScrollView>
        {/* Scrolls to the payment form */}
        <KeyboardSpacer
          onToggle={() => { setTimeout(() => this.scrollViewRef.scrollToEnd({ animated: true }),0)} }
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  textWrapper: {
    margin: 10
  },
  infoText: {
    fontSize: 18,
    textAlign: 'center'
  },
  cardFormWrapper: {
    padding: 10,
    margin: 10
  }
});