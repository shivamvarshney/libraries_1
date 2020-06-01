// Validations for Validating
export class AppValidations {
  // Validate Voucher
  public static validateVoucher(voucherNo: any) {
    let pattern = /^[0-9]*$/;
    let finalReturn;
    if (!voucherNo) {
      finalReturn = { msg: 'enter_voucher_no_error', status: false };
      return finalReturn;
    }
    if (typeof voucherNo == 'undefined') {
      finalReturn = { msg: 'enter_voucher_no_error', status: false };
      return finalReturn;
    }
    if (voucherNo.length != 16) {
      finalReturn = { msg: 'length_voucher_no_error', status: false };
      return finalReturn;
    }
    if (!voucherNo.match(pattern)) {
      finalReturn = { msg: 'valid_voucher_no_error', status: false };
      return finalReturn;
    }
    finalReturn = { msg: '', status: true };
    return finalReturn;
  }
  // Validate Phone No
  public static validatePhoneNo(phoneNo: any) {
    let pattern = /^[0-9]*$/;
    let finalReturn;
    if (!phoneNo) {
      finalReturn = { msg: 'enter_phone_no_error', status: false };
      return finalReturn;
    }
    if (typeof phoneNo == 'undefined') {
      finalReturn = { msg: 'enter_phone_no_error', status: false };
      return finalReturn;
    }
    if (phoneNo.length < 7) {
      finalReturn = { msg: 'minimum_length_phono_no_error', status: false };
      return finalReturn;
    }
    if (phoneNo.length > 16) {
      finalReturn = { msg: 'maximum_length_phono_no_error', status: false };
      return finalReturn;
    }
    if (!phoneNo.match(pattern)) {
      finalReturn = { msg: 'valid_phono_no_error', status: false };
      return finalReturn;
    }
    finalReturn = { msg: '', status: true };
    return finalReturn;
  }
  // Validate Amount
  public static validateAmount(amunt: any) {
    let pattern = /^[0-9]*$/;
    let finalReturn;
    if (!amunt) {
      finalReturn = { msg: 'please_enter_amount', status: false };
      return finalReturn;
    }
    if (typeof amunt == 'undefined') {
      finalReturn = { msg: 'please_enter_amount', status: false };
      return finalReturn;
    }
    if (amunt.length < 2) {
      finalReturn = { msg: 'minimum_digits_are_required', status: false };
      return finalReturn;
    }
    if (amunt.length > 5) {
      finalReturn = { msg: 'maximum_digits_are_required', status: false };
      return finalReturn;
    }
    if (!amunt.match(pattern)) {
      finalReturn = { msg: 'please_enter_valid_amount', status: false };
      return finalReturn;
    }
    if (amunt <= 50) {
      finalReturn = { msg: 'amount_should_be_greater_than', status: false };
      return finalReturn;
    }
    finalReturn = { msg: '', status: true };
    return finalReturn;
  }
}
