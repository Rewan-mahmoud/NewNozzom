import '../../styles/Login.css'

const Signup = () => {
  const handleSubmit = (e) => {
    e.preventDefault()
  }
  
  return (
    <div className="auth-form">
      <form className="auth-container">
        <div className="auth-wrapper">
          <div className="half">
            <h2>البيانات الشخصية</h2>
            <div className="inputGroup">
              <label>
                <span>اسم المستخدم</span>
                <input type="text" placeholder="username..." />
              </label>
            </div>
            <div className="inputGroup">
              <label>
                <span>البريد الالكتروني</span>
                <input type="email" placeholder="email..." />
              </label>
            </div>
            <div className="inputGroup">
              <label>
                <span>رقم الهاتف</span>
                <input type="text" placeholder="username..." />
              </label>
            </div>
            <div className="inputGroup">
              <label>
                <span>كلمة المرور</span>
                <input type="text" placeholder="username..." />
              </label>
            </div>
          </div>
          <div className="half">
            <h2>بيانات الشركة</h2>
            <div className="inputGroup">
              <label>
                <span>اسم الشركة</span>
                <input type="text" placeholder="username..." />
              </label>
            </div>
            <div className="inputGroup">
              <label>
                <span>هاتف الشركة</span>
                <input type="email" placeholder="email..." />
              </label>
            </div>
            <div className="inputGroup">
              <label>
                <span>عنوان الشركة</span>
                <input type="text" placeholder="username..." />
              </label>
            </div>
            <div className="inputGroup">
              <label>
                <span>الرقم الضريبي</span>
                <input type="text" placeholder="username..." />
              </label>
            </div>
          </div>
        </div>
      <button onClick={handleSubmit}>انشاء حساب</button>
      </form>
    </div>
  );
}

export default Signup