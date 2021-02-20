import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Button,
  ListItem,
  makeStyles
} from '@material-ui/core';
import List from '@material-ui/core/List';
import Collapse from '@material-ui/core/Collapse';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import NavItem from './NavItem';

const useStyles = makeStyles((theme) => ({
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
    justifyContent: 'flex-start',
    letterSpacing: 0,
    padding: '10px 8px',
    textTransform: 'none',
    width: '100%'
  },
  icon: {
    marginRight: theme.spacing(1)
  },
  title: {
    marginRight: 'auto'
  },
  active: {
    color: theme.palette.primary.main,
    '& $title': {
      fontWeight: theme.typography.fontWeightMedium
    },
    '& $icon': {
      color: theme.palette.primary.main
    }
  },
  nested: {
    paddingLeft: theme.spacing(4),
  }
}));

const NavNestedItem = ({
  className,
  href,
  icon: Icon,
  title,
  _children,
  ...rest
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItem
        className={clsx(classes.item, className)}
        disableGutters
        {...rest}
      >
        <Button
          className={classes.button}
          onClick={handleClick}
        >
          {Icon && (
            <Icon
              className={classes.icon}
              size="20"
            />
          )}
          <span className={classes.title}>
            {title}
          </span>
          {open ? <ExpandLess /> : <ExpandMore />}
        </Button>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List className={classes.nested}>
          {_children.map((child) => (
            <NavItem
              href={child.href}
              key={child.title}
              title={child.title}
              icon={child.icon}
            />
          ))}
        </List>
      </Collapse>
    </ >
  );
};

NavNestedItem.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.elementType,
  title: PropTypes.string,
  _children: PropTypes.array,
};

export default NavNestedItem;
