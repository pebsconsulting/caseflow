import * as Constants from './actionTypes';
import { update } from '../../util/ReducerUtil';
import { updateFilteredDocIds } from '../helpers/reducerHelper';
import _ from 'lodash';
import { moveModel } from '../utils';

const initialState = {
  annotations: {},
  placingAnnotationIconPageCoords: null,

  ui: {
    pendingAnnotations: {},
    pendingEditingAnnotations: {},
    selectedAnnotationId: null,
    deleteAnnotationModalIsOpenFor: null,
    placedButUnsavedAnnotation: null
  },

  /**
   * `editingAnnotations` is an object of annotations that are currently being edited.
   * When a user starts editing an annotation, we copy it from `annotations` to `editingAnnotations`.
   * To commit the edits, we copy from `editingAnnotations` back into `annotations`.
   * To discard the edits, we delete from `editingAnnotations`.
   */
  editingAnnotations: {}
};

const annotationReducer = (state = initialState, action = {}) => {
  switch (action.type) {
  case Constants.SHOW_PLACE_ANNOTATION_ICON:
    return update(state, {
      placingAnnotationIconPageCoords: {
        $set: {
          pageIndex: action.payload.pageIndex,
          ...action.payload.pageCoords
        }
      }
    });
  case Constants.STOP_PLACING_ANNOTATION:
    return update(state, {
      placingAnnotationIconPageCoords: {
        $set: null
      },
      ui: {
        placedButUnsavedAnnotation: { $set: null },
        pdf: {
          isPlacingAnnotation: { $set: false }
        }
      }
    });
  case Constants.RECEIVE_ANNOTATIONS:
    return updateFilteredDocIds(update(
      state,
      {
        annotations: {
          $set: _(action.payload.annotations).
            map((annotation) => ({
              documentId: annotation.document_id,
              uuid: annotation.id,
              ...annotation
            })).
            keyBy('id').
            value()
        }
      }
    ));
  case Constants.REQUEST_DELETE_ANNOTATION:
    return update(state, {
      editingAnnotations: {
        [action.payload.annotationId]: {
          $apply: (annotation) => annotation && {
            ...annotation,
            pendingDeletion: true
          }
        }
      },
      annotations: {
        [action.payload.annotationId]: {
          $merge: {
            pendingDeletion: true
          }
        }
      }
    });
  case Constants.REQUEST_DELETE_ANNOTATION_FAILURE:
    return update(state, {
      editingAnnotations: {
        [action.payload.annotationId]: {
          $unset: 'pendingDeletion'
        }
      },
      annotations: {
        [action.payload.annotationId]: {
          $unset: 'pendingDeletion'
        }
      }
    });
  case Constants.REQUEST_DELETE_ANNOTATION_SUCCESS:
    return update(state, {
      editingAnnotations: {
        $unset: action.payload.annotationId
      },
      annotations: {
        $unset: action.payload.annotationId
      }
    });
  case Constants.REQUEST_CREATE_ANNOTATION:
    return update(state, {
      ui: {
        placedButUnsavedAnnotation: { $set: null },
        pendingAnnotations: {
          [action.payload.annotation.id]: {
            $set: action.payload.annotation
          }
        }
      }
    });
  case Constants.REQUEST_CREATE_ANNOTATION_SUCCESS:
    return update(state, {
      ui: {
        pendingAnnotations: {
          $unset: action.payload.annotationTemporaryId
        }
      },
      annotations: {
        [action.payload.annotation.id]: {
          $set: {
            // These two duplicate fields exist on annotations throughout the app.
            // I am not sure why this is, but we'll patch it here to make everything work.
            document_id: action.payload.annotation.documentId,
            uuid: action.payload.annotation.id,

            ...action.payload.annotation
          }
        }
      }
    });
  case Constants.REQUEST_CREATE_ANNOTATION_FAILURE:
    return update(state, {
      ui: {
        // This will cause a race condition if the user has created multiple annotations.
        // Whichever annotation failed most recently is the one that'll be in the
        // "new annotation" text box. For now, I think that's ok.
        placedButUnsavedAnnotation: {
          $set: state.ui.pendingAnnotations[action.payload.annotationTemporaryId]
        },
        pendingAnnotations: {
          $unset: action.payload.annotationTemporaryId
        }
      }
    });
  case Constants.START_EDIT_ANNOTATION:
    return update(state, {
      editingAnnotations: {
        [action.payload.annotationId]: {
          $set: state.annotations[action.payload.annotationId]
        }
      }
    });
  case Constants.CANCEL_EDIT_ANNOTATION:
    return update(state, {
      editingAnnotations: {
        $unset: action.payload.annotationId
      }
    });
  case Constants.UPDATE_ANNOTATION_CONTENT:
    return update(state, {
      editingAnnotations: {
        [action.payload.annotationId]: {
          comment: {
            $set: action.payload.content
          }
        }
      }
    });
  case Constants.REQUEST_EDIT_ANNOTATION:
    return moveModel(state,
      ['editingAnnotations'],
      ['ui', 'pendingEditingAnnotations'],
      action.payload.annotationId
    );
  case Constants.REQUEST_EDIT_ANNOTATION_SUCCESS:
    return moveModel(state,
      ['ui', 'pendingEditingAnnotations'],
      ['annotations'],
      action.payload.annotationId
    );
  case Constants.REQUEST_EDIT_ANNOTATION_FAILURE:
    return moveModel(state,
      ['ui', 'pendingEditingAnnotations'],
      ['editingAnnotations'],
      action.payload.annotationId
    );
  case Constants.SELECT_ANNOTATION:
    return update(state, {
      ui: {
        selectedAnnotationId: {
          $set: action.payload.annotationId
        }
      }
    });
  case Constants.REQUEST_MOVE_ANNOTATION:
    return update(state, {
      ui: {
        pendingEditingAnnotations: {
          [action.payload.annotation.id]: {
            $set: action.payload.annotation
          }
        }
      }
    });
  case Constants.REQUEST_MOVE_ANNOTATION_SUCCESS:
    return moveModel(
      state,
      ['ui', 'pendingEditingAnnotations'],
      ['annotations'],
      action.payload.annotationId
    );
  case Constants.REQUEST_MOVE_ANNOTATION_FAILURE:
    return update(state, {
      ui: {
        pendingEditingAnnotations: {
          $unset: action.payload.annotationId
        }
      }
    });
  case Constants.PLACE_ANNOTATION:
    return update(state, {
      ui: {
        placedButUnsavedAnnotation: {
          $set: {
            ...action.payload,
            class: 'Annotation',
            type: 'point'
          }
        },
        pdf: {
          isPlacingAnnotation: { $set: false }
        }
      }
    });
  case Constants.START_PLACING_ANNOTATION:
    return update(state, {
      ui: {
        pdf: {
          isPlacingAnnotation: { $set: true }
        }
      },
      openedAccordionSections: {
        $apply: (sectionKeys) => _.union(sectionKeys, [Constants.COMMENT_ACCORDION_KEY])
      }
    });
  default:
    return state;
  }
};

export default annotationReducer;
