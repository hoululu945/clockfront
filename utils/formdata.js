class FormData {
  constructor() {
    this._boundary = `-------${Date.now()}`;
    this._formData = [];
  }

  append(name, value) {
    this._formData.push(`--${this._boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`);
  }

  getFormData() {
    let formData = this._formData.join('');
    formData += `--${this._boundary}--\r\n`;

    return formData;
  }
}