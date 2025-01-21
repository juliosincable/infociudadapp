import './ExploreContainer.css';

interface ContainerProps { }

const ExploreContainer: React.FC<ContainerProps> = () => {
  return (
    <div id="container">
      <strong>Guía de la ciudad</strong>
      <p>Toda la información de tu ciudad <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components"> de Turmero</a></p>
    </div>
  );
};

export default ExploreContainer;
