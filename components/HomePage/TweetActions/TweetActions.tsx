import { Box, Text, Tooltip } from '@chakra-ui/react';
import { DocumentData } from 'firebase/firestore';
import { IconType } from 'react-icons/lib';
import { Comment, Tweet } from '../../../types';
import {
  IoChatbubbleOutline,
  IoHeart,
  IoHeartOutline,
  IoRepeatOutline,
  IoShareOutline,
} from 'react-icons/io5';

import useTweets from '../../../hooks/useTweets';
import styles from './TweetActions.module.css';

type ActionProps = {
  name: string;
  label: number;
  color?: string;
  liked?: boolean;
  hideLabel?: boolean;
  Icon: IconType;
  onLike?: VoidFunction;
  onComment?: VoidFunction;
  onShare?: VoidFunction;
  onRetweet?: VoidFunction;
};

const Action = (props: ActionProps) => {
  return (
    <Tooltip className="tooltip" label={props.name}>
      <Box
        className={styles.action}
        data-bg={props.color}
        onClick={e => {
          e.stopPropagation();
          props.onLike && props.onLike();
          props.onComment && props.onComment();
        }}
      >
        <Box className={styles['action-icon']} data-liked={props.liked}>
          <props.Icon />
        </Box>
        <Text className={styles['action-label']} data-hide={props.hideLabel}>
          {props.label}
        </Text>
      </Box>
    </Tooltip>
  );
};

type Props = {
  tweet?: DocumentData | Tweet;
  comment?: DocumentData | Comment;
  isFullWidth?: boolean; // Make Actions container full width
  hideLabel?: boolean; // Hide label for each action
  isReply?: boolean; // Show only comment action
  onOpen: VoidFunction; // For comment modal
};

const TweetActions = ({ tweet, comment, isFullWidth, hideLabel, onOpen }: Props) => {
  const { commentLiked, commentLikes, liked, likes, comments, addLike, addLikeComment } = useTweets(
    tweet?.id,
    comment?.id
  );

  return (
    <Box className={styles.actions} data-full={isFullWidth}>
      <Action
        name="Reply"
        label={!comment ? comments.length : 0}
        Icon={IoChatbubbleOutline}
        onComment={onOpen}
        hideLabel={hideLabel}
      />
      <Action name="Retweet" label={0} Icon={IoRepeatOutline} color="green" hideLabel={hideLabel} />
      <Action
        name="Like"
        color="pink"
        label={!comment ? likes.length : commentLikes.length}
        liked={!comment ? liked : commentLiked}
        Icon={
          !comment ? (liked ? IoHeart : IoHeartOutline) : commentLiked ? IoHeart : IoHeartOutline
        }
        onLike={() => {
          !comment ? addLike(tweet?.id) : addLikeComment(tweet?.id, comment?.id);
        }}
        hideLabel={hideLabel}
      />
      <Action name="Share" label={0} Icon={IoShareOutline} hideLabel={hideLabel} />
    </Box>
  );
};
export default TweetActions;
