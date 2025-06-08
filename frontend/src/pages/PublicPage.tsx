import React, { useState, useEffect } from 'react';
import { 
    IonContent, 
    IonPage, 
    IonGrid, 
    IonRow, 
    IonCol, 
    IonCard, 
    IonCardHeader, 
    IonCardSubtitle, 
    IonCardTitle, 
    IonCardContent, 
    IonSearchbar,
    IonChip,
    IonIcon,
    IonText,
    IonButton,
    IonToast,
    IonLoading,
    IonList, 
    IonItem, 
    IonLabel 
} from '@ionic/react';
import { useEmpresas } from '../EmpresasContext';
// 'ticketOutline' ha sido eliminado de las importaciones ya que no se usaba.
import { callOutline, mailOutline, logoWhatsapp, logoInstagram, linkOutline, locationOutline, timeOutline, logoTiktok } from 'ionicons/icons';

const PublicPage: React.FC = () => {
  const { empresas, fetchEmpresas, isLoading, error, clearError } = useEmpresas();
  const [searchText, setSearchText] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchEmpresas();
  }, [fetchEmpresas]);

  useEffect(() => {
    if (error) {
      setToastMessage(error);
      setShowToast(true);
      clearError();
    }
  }, [error, clearError]);

  const filteredEmpresas = empresas.filter(empresa => {
    const searchLower = searchText.toLowerCase();
    return (
      empresa.nombre.toLowerCase().includes(searchLower) ||
      (empresa.categoria && empresa.categoria.toLowerCase().includes(searchLower)) ||
      (empresa.descripcion && empresa.descripcion.toLowerCase().includes(searchLower)) ||
      (empresa.servicios && empresa.servicios.some(servicio => servicio.toLowerCase().includes(searchLower)))
    );
  });

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding">
        <IonSearchbar
          value={searchText}
          onIonChange={(e) => setSearchText(e.detail.value!)}
          placeholder="Buscar empresas, categorías o servicios..."
        ></IonSearchbar>

        {isLoading && <IonLoading isOpen={true} message={"Cargando..."} />}
        {filteredEmpresas.length === 0 && !isLoading && (
          <IonText color="medium">
            <p className="ion-text-center ion-padding-top">No se encontraron empresas.</p>
          </IonText>
        )}

        <IonGrid className="ion-margin-top">
          <IonRow>
            {filteredEmpresas.map(empresa => (
              <IonCol size-xs="12" size-sm="6" size-md="4" size-lg="3" key={empresa.id}>
                <IonCard>
                  <IonCardHeader>
                    {empresa.logoUrl && <img src={empresa.logoUrl} alt={`${empresa.nombre} logo`} className="company-logo" />}
                    <IonCardTitle>{empresa.nombre}</IonCardTitle>
                    {empresa.categoria && <IonCardSubtitle>{empresa.categoria}</IonCardSubtitle>}
                  </IonCardHeader>
                  <IonCardContent>
                    {empresa.descripcion && <p>{empresa.descripcion}</p>}
                    <IonList lines="none">
                      {empresa.direccion && (
                        <IonItem>
                          <IonIcon icon={locationOutline} slot="start" />
                          <IonLabel>{empresa.direccion}</IonLabel>
                        </IonItem>
                      )}
                      {empresa.telefono && (
                        <IonItem href={`tel:${empresa.telefono}`}>
                          <IonIcon icon={callOutline} slot="start" />
                          <IonLabel>{empresa.telefono}</IonLabel>
                        </IonItem>
                      )}
                      {empresa.whatsapp && (
                        <IonItem href={`https://wa.me/${empresa.whatsapp}`} target="_blank" rel="noopener noreferrer">
                          <IonIcon icon={logoWhatsapp} slot="start" color="success" />
                          <IonLabel>{empresa.whatsapp}</IonLabel>
                        </IonItem>
                      )}
                      {empresa.email && (
                        <IonItem href={`mailto:${empresa.email}`}>
                          <IonIcon icon={mailOutline} slot="start" />
                          <IonLabel>{empresa.email}</IonLabel>
                        </IonItem>
                      )}
                      {empresa.horarioAtencion && (
                        <IonItem>
                          <IonIcon icon={timeOutline} slot="start" />
                          <IonLabel>{empresa.horarioAtencion}</IonLabel>
                        </IonItem>
                      )}
                      {empresa.sitioWeb && (
                        <IonItem href={empresa.sitioWeb} target="_blank" rel="noopener noreferrer">
                          <IonIcon icon={linkOutline} slot="start" />
                          <IonLabel>{empresa.sitioWeb}</IonLabel>
                        </IonItem>
                      )}
                      {empresa.instagram && (
                        <IonItem href={`https://instagram.com/${empresa.instagram}`} target="_blank" rel="noopener noreferrer">
                          <IonIcon icon={logoInstagram} slot="start" color="danger" />
                          <IonLabel>@{empresa.instagram}</IonLabel>
                        </IonItem>
                      )}
                      {empresa.tiktok && (
                        <IonItem href={`https://tiktok.com/@${empresa.tiktok}`} target="_blank" rel="noopener noreferrer">
                          <IonIcon icon={logoTiktok} slot="start" />
                          <IonLabel>@{empresa.tiktok}</IonLabel>
                        </IonItem>
                      )}
                    </IonList>

                    {empresa.servicios && empresa.servicios.length > 0 && (
                      <div className="ion-margin-top">
                        <IonText color="dark"><strong>Servicios:</strong></IonText>
                        <div className="ion-chip-list">
                          {empresa.servicios.map((servicio, index) => (
                            <IonChip key={index} outline color="primary">
                              <IonLabel>{servicio}</IonLabel>
                            </IonChip>
                          ))}
                        </div>
                      </div>
                    )}

                    {empresa.ubicacionGps && (empresa.ubicacionGps.lat !== 0 || empresa.ubicacionGps.lng !== 0) && (
                      <IonButton 
                        expand="block" 
                        fill="outline" 
                        className="ion-margin-top"
                        href={`http://maps.google.com/maps?q=${empresa.ubicacionGps.lat},${empresa.ubicacionGps.lng}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <IonIcon icon={locationOutline} slot="start" />
                        Ver en Mapa
                      </IonButton>
                    )}
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <IonToast
          isOpen={showToast}
          message={toastMessage}
          duration={3000}
          onDidDismiss={() => setShowToast(false)}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default PublicPage;