import { authentication, authorization } from '../../middleware/auth.middleware.js';
import { validation } from '../../middleware/validation.middleware.js';
import { fileValidations, uploadCloudfile } from '../../utilies/multer/cloud.multer.js';
import { endpoint } from './service/comment.auth.js';
import * as commentService from './service/comment.service.js';
import * as validators from './service/comment.validation.js'
import { Router } from 'express';

const router = Router({
    mergeParams:true

});

router.post('/commentId?',
    authentication(),
    authorization(endpoint.create),
    uploadCloudfile(fileValidations.image).array('attachments' , 2),
    validation(validators.createComment),
     commentService.createComment);

 router.patch('/:commentId',
        authentication(),
        authorization(endpoint.update),
        uploadCloudfile(fileValidations.image).array('attachments' , 2),
        validation(validators.updateComment),
         commentService.updateComment);

 router.delete('/:commentId/frezze',
            authentication(),
            authorization(endpoint.freeze),
            validation(validators.freezeComment),
             commentService.freezeComment);

 router.patch('/:commentId/unfrezze',
                authentication(),
                authorization(endpoint.freeze),
                validation(validators.freezeComment),
                 commentService.unfreezeComment);
        
    

export default router;