import React, { useContext } from 'react'; 
import Button from '@material-ui/core/Button'; 
import Tooltip from '@material-ui/core/Tooltip';

import PromptLoginModal from '@general/modals/prompt-login-modal.js';
import ShareExperiencesModal from '@general/modals/share-experiences-modal';

import ModalService from '@services/modal.service';  

import { AppContext } from '@contexts/app.context';

export default function ShareExperience() {   
    const { appState } = useContext(AppContext);  
    const isLoggedIn = appState.sessionId ? true : false;

    const modalService = ModalService.getInstance();  

    const handleShareExperience = () => {     
        if(!isLoggedIn){  
            modalService.toggleModal('promptLoginExperiences', true); 
        } else {   
            modalService.toggleModal('promptShareExperiences', true);       
        }    
      };

  return (
    <> 
        <Tooltip title="Got tested here? Share your experience!" placement="left">
            <Button
                variant="contained"
                color="primary"
                style={{ borderRadius:15 }}
                onClick={handleShareExperience.bind(this)}
            >
                Share Experience
            </Button>
        </Tooltip>
        <PromptLoginModal
            titleText="To share your experience, please log in to an existing AllClear account, or create a new one." 
            modalName="promptLoginExperiences"
        />
        <ShareExperiencesModal />
    </>
  );
}


