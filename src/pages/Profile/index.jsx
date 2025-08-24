// CSS Module
import S from './style.module.css';
// Libraries
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
// Contexts
import { useAuth } from '../../contexts/AuthContext';
// Components
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
// Icons
import { ArrowLeft, QrCode, Download, Copy, Check, Crown, Shield, User, Mail } from 'lucide-react';
import { toast } from 'sonner';

function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [copied, setCopied] = React.useState(false);

  // If no user, redirect to sign in
  React.useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    }
  }, [user, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleCopyUserId = async () => {
    try {
      await navigator.clipboard.writeText(user.id.toString());
      setCopied(true);
      toast.success('User ID copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Copy failed');
    }
  };

  const handleDownloadQR = () => {
    const canvas = document.getElementById('qr-code');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `user-${user.id}-qr.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  if (!user) {
    return null;
  }

  return (
    <main className={S.main}>
      {/* Background Pattern */}
      <div className={S.backgroundPattern}></div>
      
      <div className={S.container}>
        {/* Main Profile Content */}
        <div className={S.profileGrid}>
          {/* User Info Card */}
          <Card className={S.userInfoCard}>
            <CardContent className={S.userInfoContent}>
              <div className={S.userHeader}>
                <div className={S.avatarContainer}>
                  <Avatar className={S.avatar}>
                    <AvatarFallback className={S.avatarFallback}>
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className={S.statusIndicator}></div>
                </div>
                
                <div className={S.userDetails}>
                  <h2 className={S.username}>{user.username}</h2>
                  <p className={S.userEmail}>{user.email}</p>
                </div>
              </div>

              {/* Roles Section */}
              {user.roles && user.roles.length > 0 && (
                <div className={S.rolesSection}>
                  <h3 className={S.sectionTitle}>
                    <Crown className={S.sectionIcon} />
                    Roles & Permissions
                  </h3>
                  <div className={S.rolesGrid}>
                    {user.roles.map((role, index) => (
                      <Badge key={index} variant="secondary" className={S.roleBadge}>
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* QR Code Card */}
          <Card className={S.qrCard}>
            <CardHeader className={S.qrHeader}>
              <CardTitle className={S.qrTitle}>
                <QrCode className={S.qrIcon} />
                Quick Access QR Code
              </CardTitle>
              <CardDescription className={S.qrDescription}>
                Scan this code for instant identification
              </CardDescription>
            </CardHeader>
            
            <CardContent className={S.qrContent}>
              <div className={S.qrDisplay}>
                <div className={S.qrWrapper}>
                  <QRCodeSVG
                    id="qr-code"
                    value={user.id.toString()}
                    size={180}
                    level="H"
                    className={S.qrCode}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default Profile;
