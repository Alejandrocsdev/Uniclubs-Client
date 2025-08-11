// CSS Module
import S from './style.module.css';
// Libraries
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
// Custom Functions
import { api, axiosPublic } from '../../api';
import { useMessage } from '../../contexts/MessageContext';
import { useUpdateEffect } from '../../hooks';
// Validations
import { resetSchema, recoverSchema } from '../../validations';
// Components
import Card from '../../components/Card';
import Form from '../../components/Form';
import Input from '../../components/Input';
import Anchor from '../../components/Anchor';
import OtpInput from '../../components/OtpInput';
import Submit from '../../components/Submit';
import PwdSuccess from './PwdSuccess';
import UsrSuccess from './UsrSuccess';

function Recovery() {
  const { setSucMsg, setErrMsg } = useMessage();
  const { pathname } = useLocation();
  const [formExtra, setFormExtra] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const target = pathname.split('/').pop();
  const isPassword = target === 'password';

  // Form extra methods
  const { reset, resetField, setFocus, isSubmitting } = formExtra || {};
  useUpdateEffect(() => reset && reset(), [isPassword]);

  const onReset = async formData => {
    await api(axiosPublic.post('/api/recovery/password', formData), {
      onSuccess: () => {
        setSucMsg('Password updated successfully.');
        setShowSuccess(true);
      },
      onError: error => {
        const { type } = error.response?.data?.details || {};
        if (error.status === 400 && type === 'otp failure') {
          setErrMsg('OTP verification failed or expired.');
          resetField && resetField('otp');
          setFocus && setFocus('otp');
        } else {
          setErrMsg('Failed to reset password.');
          reset && reset();
        }
        setShowSuccess(false);
      },
    });
  };

  const onRecover = async formData => {
    await api(axiosPublic.post('/api/recovery/username', formData), {
      onSuccess: () => {
        setSucMsg('Username sent successfully.');
        setShowSuccess(true);
      },
      onError: error => {
        const { type } = error.response?.data?.details || {};
        if (error.status === 400 && type === 'otp failure') {
          setErrMsg('OTP verification failed or expired.');
          resetField && resetField('otp');
          setFocus && setFocus('otp');
        } else {
          setErrMsg('Failed to send username email.');
          reset && reset();
        }
        setShowSuccess(false);
      },
    });
  };

  if (isPassword && showSuccess) return <PwdSuccess />;
  if (!isPassword && showSuccess) return <UsrSuccess />;

  return (
    <div className={S.page}>
      <div className={S.bg} aria-hidden />
      <div className={S.shell}>
        <Card
          prevPath="/sign-in"
          title={isPassword ? 'Reset Password' : 'Recover Username'}
          className="text-white"
        >
          <Form
            extra={setFormExtra}
            schema={isPassword ? resetSchema : recoverSchema}
            onSubmit={isPassword ? onReset : onRecover}
          >
            {/* Password */}
            {isPassword && (
              <Input
                name="password"
                placeholder="New password"
                maxLength={64}
                type="password"
                autoComplete="new-password"
              />
            )}

            {/* Confirm Password */}
            {isPassword && (
              <Input
                name="rePassword"
                placeholder="Repeat password"
                maxLength={64}
                type="password"
                autoComplete="new-password"
              />
            )}

            {/* Email */}
            <Input
              name="email"
              placeholder="Email"
              maxLength={254}
              type="email"
              autoComplete="email"
            />

            {/* OTP */}
            <OtpInput name="otp" />

            {/* Submit */}
            <Submit loaderSize={10} isSubmitting={isSubmitting}>
              Submit
            </Submit>

            {/* Switch (match Sign’s style classes) */}
            <Anchor
              style={S.recoverLink}
              int={`/recovery/${isPassword ? 'username' : 'password'}`}
            >
              {`Forgot ${isPassword ? 'username' : 'password'}?`}
            </Anchor>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default Recovery;