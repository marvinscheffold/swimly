"use client";

import { SectionRow } from "@/app/_components/Section";
import { Delete, Save } from "@mui/icons-material";
import {
  Alert,
  FormHelperText,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { PoolType } from "@/app/_utils/types/pool";
import { FormEvent, useState } from "react";
import { PoolSearchInputAndSelectDropdown } from "@/app/_features/pool/PoolSearchInputAndSelectDropdown";
import { teacherCreateOrDeleteTeacherPoolsAction } from "@/app/_features/teacher/actions/teacherCreateOrDeleteTeacherPoolsAction";
import { useMutation } from "@tanstack/react-query";
import { LoadingButton } from "@mui/lab";
import { ServerActionResponseAlert } from "@/app/_components/ServerActionResponseAlert";

type TeacherCreatePagePoolsFormProps = {
  pools: PoolType[];
};

export function TeacherCreatePagePoolsForm({
  pools: poolsProps,
}: TeacherCreatePagePoolsFormProps) {
  const [pools, setPools] = useState(poolsProps);
  const mutation = useMutation({
    mutationFn: teacherCreateOrDeleteTeacherPoolsAction,
  });

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    mutation.mutate(
      {
        poolIds: pools.map((p) => p.id),
      },
      {}
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <SectionRow
        leftChildren={
          <div className="flex flex-col gap-6">
            {pools.length > 0 ? (
              <List>
                {pools.map((pool) => (
                  <ListItem
                    key={pool.id}
                    disableGutters
                    divider
                    secondaryAction={
                      <IconButton
                        aria-label="löschen"
                        onClick={() => {
                          setPools((pools) =>
                            pools.filter((p) => p.id !== pool.id)
                          );
                        }}
                      >
                        <Delete />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={pool.name}
                      secondary={`${pool.street} ${pool.streetNumber}, ${pool.zip} ${pool.city}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1">
                Du hast noch keine Schwimmbäder hinzugefügt
              </Typography>
            )}

            <div className="flex flex-col">
              <PoolSearchInputAndSelectDropdown
                disabledOptionValues={pools.map((p) => p.id)}
                onSelect={(pool) => {
                  if (!pool) return;
                  setPools((pools) => [...pools, pool]);
                }}
              />
              <div className="ml-[14px]">
                <FormHelperText>
                  Falls ein Schwimmbad fehlt schreib uns eine Email an
                  info@phelb.com
                </FormHelperText>
              </div>
            </div>
          </div>
        }
        rightChildren={
          <Alert className="w-full" severity="info" variant="outlined">
            Wenn du Schwimmbäder hinzufügst, in denen du unterrichtest, erhältst
            du passende Nachrichten von Schülern.
          </Alert>
        }
      />

      <ServerActionResponseAlert serverActionResponse={mutation.data} />

      <div>
        <LoadingButton
          loadingPosition="start"
          startIcon={<Save />}
          variant="contained"
          type="submit"
          loading={mutation.isPending}
        >
          Speichern
        </LoadingButton>
      </div>
    </form>
  );
}
